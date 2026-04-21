
import type { Complaint, FeedbackItem, NotificationItem, InvoiceSummary } from '../components/customerDashboard/types';

const STORAGE_KEYS = {
  COMPLAINTS: 'uc_dashboard_complaints',
  NOTIFICATIONS: 'uc_dashboard_notifications',
  INVOICES: 'uc_dashboard_invoices',
  FEEDBACK: 'uc_dashboard_feedback',
  FILTERS: 'uc_dashboard_filters'
};

export const customerDashboardService = {
  getComplaints: (initial: Complaint[]): Complaint[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveComplaints: (complaints: Complaint[]) => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  },

  getNotifications: (initial: NotificationItem[]): NotificationItem[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveNotifications: (notifications: NotificationItem[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getInvoices: (initial: InvoiceSummary[]): InvoiceSummary[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveInvoices: (invoices: InvoiceSummary[]) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  getFeedback: (initial: FeedbackItem[]): FeedbackItem[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveFeedback: (feedback: FeedbackItem[]) => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
  },

  getFilters: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return stored ? JSON.parse(stored) : null;
  },

  saveFilters: (filters: any) => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  }
};
