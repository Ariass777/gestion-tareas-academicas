import { InjectionToken } from '@angular/core';

// En desarrollo el proxy reenvía /api a Laravel; en producción se publica bajo el mismo origen.
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
