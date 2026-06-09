/// <reference types="cypress" />

import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../../src/stores/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    
    // Clear session storage
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it('should initialize with unauthenticated state', () => {
    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).to.be.false;
    expect(authStore.sessionExpiry).to.be.null;
    expect(authStore.isSessionValid).to.be.false;
  });

  it('should set authenticated state with expiry', () => {
    const authStore = useAuthStore();
    
    // Set authenticated state
    authStore.setAuthenticated(true);
    
    // Check state was updated
    expect(authStore.isAuthenticated).to.be.true;
    expect(authStore.sessionExpiry).to.be.a('number');
    expect(authStore.isSessionValid).to.be.true;
    
    // Check session storage was updated
    cy.window().then((win) => {
      const sessionData = JSON.parse(win.sessionStorage.getItem('auth_session') || '{}');
      expect(sessionData.isAuthenticated).to.be.true;
      expect(sessionData.sessionExpiry).to.be.a('number');
    });
  });

  it('should clear auth state', () => {
    const authStore = useAuthStore();
    
    // Set authenticated state first
    authStore.setAuthenticated(true);
    expect(authStore.isAuthenticated).to.be.true;
    
    // Clear auth state
    authStore.clearAuth();
    
    // Check state was cleared
    expect(authStore.isAuthenticated).to.be.false;
    expect(authStore.sessionExpiry).to.be.null;
    expect(authStore.isSessionValid).to.be.false;
    
    // Check session storage was cleared
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('auth_session')).to.be.null;
    });
  });

  it('should detect expired session', () => {
    const authStore = useAuthStore();
    
    // Manually set an expired session
    authStore.isAuthenticated = true;
    authStore.sessionExpiry = Date.now() - 1000; // 1 second in the past
    
    // Session should be invalid
    expect(authStore.isSessionValid).to.be.false;
  });

  it('should persist and restore auth state', () => {
    const authStore = useAuthStore();
    
    // Set authenticated state
    authStore.setAuthenticated(true);
    
    // Create a new store instance (simulating page refresh)
    setActivePinia(createPinia());
    const newAuthStore = useAuthStore();
    
    // State should be restored from session storage
    expect(newAuthStore.isAuthenticated).to.be.true;
    expect(newAuthStore.sessionExpiry).to.be.a('number');
    expect(newAuthStore.isSessionValid).to.be.true;
  });
});
