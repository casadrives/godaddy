describe('Driver Tracking', () => {
  beforeEach(() => {
    // Mock geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
        return cb({
          coords: {
            latitude: 49.6116,
            longitude: 6.1319,
            heading: 90,
            speed: 30,
          },
        });
      });

      cy.stub(win.navigator.geolocation, 'watchPosition').callsFake((cb) => {
        const id = setInterval(() => {
          cb({
            coords: {
              latitude: 49.6116 + Math.random() * 0.001,
              longitude: 6.1319 + Math.random() * 0.001,
              heading: 90,
              speed: 30,
            },
          });
        }, 1000);
        return id;
      });
    });
  });

  it('should request GPS permissions on ride accept', () => {
    cy.visit('/rides');
    cy.intercept('POST', '/api/v1/ride/*/accept').as('acceptRide');
    
    cy.get('[data-testid="accept-ride-btn"]').first().click();
    cy.wait('@acceptRide');
    
    cy.window().then((win) => {
      expect(win.navigator.geolocation.getCurrentPosition).to.be.called;
    });
  });

  it('should start tracking after permission granted', () => {
    cy.visit('/rides/active');
    cy.intercept('POST', '/api/v1/driver/location').as('updateLocation');
    
    // Wait for first location update
    cy.wait('@updateLocation').then((interception) => {
      expect(interception.request.body).to.have.property('latitude');
      expect(interception.request.body).to.have.property('longitude');
    });

    // Should update location periodically
    cy.wait('@updateLocation');
    cy.wait('@updateLocation');
  });

  it('should show tracking modal with map', () => {
    cy.visit('/rides/active');
    
    cy.get('[data-testid="tracking-modal"]').should('be.visible');
    cy.get('[data-testid="map-container"]').should('be.visible');
    cy.get('[data-testid="driver-marker"]').should('exist');
  });

  it('should update ETA based on location', () => {
    cy.visit('/rides/active');
    cy.intercept('GET', '/api/v1/ride/*/eta').as('getEta');
    
    cy.wait('@getEta').then((interception) => {
      const initialEta = interception.response.body.eta;
      
      // Wait for next ETA update
      cy.wait('@getEta').then((nextInterception) => {
        const nextEta = nextInterception.response.body.eta;
        expect(nextEta).to.not.equal(initialEta);
      });
    });
  });

  it('should stop tracking when ride completes', () => {
    cy.visit('/rides/active');
    cy.intercept('POST', '/api/v1/driver/location').as('updateLocation');
    
    // Complete the ride
    cy.get('[data-testid="complete-ride-btn"]').click();
    cy.get('[data-testid="confirm-complete-btn"]').click();
    
    // Location updates should stop
    cy.wait(5000);
    cy.get('@updateLocation.all').then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
  });

  it('should handle GPS errors gracefully', () => {
    cy.visit('/rides');
    
    // Simulate GPS error
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb, err) => {
        err({ code: 1, message: 'User denied geolocation' });
      });
    });
    
    cy.get('[data-testid="accept-ride-btn"]').first().click();
    cy.get('[data-testid="gps-error-message"]').should('be.visible');
  });
});
