/**
 * Global toast notification utility
 * Use like console.log: toast.success('message')
 * No dependency injection needed
 */

let toastServiceInstance: any = null;

/**
 * Initialize the global toast with ToastService instance
 * Called once from app.component
 */
export function initializeGlobalToast(toastService: any): void {
  toastServiceInstance = toastService;
}

/**
 * Show a success toast message
 */
export function success(summary: string, detail?: string): void {
  if (!toastServiceInstance) {
    console.warn('Toast service not initialized. Call initializeGlobalToast first.');
    return;
  }
  toastServiceInstance.showSuccess(summary, detail);
}

/**
 * Show an error toast message
 */
export function error(summary: string, detail?: string): void {
  if (!toastServiceInstance) {
    console.warn('Toast service not initialized. Call initializeGlobalToast first.');
    return;
  }
  toastServiceInstance.showError(summary, detail);
}

/**
 * Show an info toast message
 */
export function info(summary: string, detail?: string): void {
  if (!toastServiceInstance) {
    console.warn('Toast service not initialized. Call initializeGlobalToast first.');
    return;
  }
  toastServiceInstance.showInfo(summary, detail);
}

/**
 * Show a warning toast message
 */
export function warning(summary: string, detail?: string): void {
  if (!toastServiceInstance) {
    console.warn('Toast service not initialized. Call initializeGlobalToast first.');
    return;
  }
  toastServiceInstance.showWarning(summary, detail);
}

/**
 * Clear all toast messages
 */
export function clear(): void {
  if (!toastServiceInstance) {
    return;
  }
  toastServiceInstance.clear();
}

// Export as namespace for convenient usage: toast.success() etc
export const toast = {
  success,
  error,
  info,
  warning,
  clear
};
