import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  constructor() {}

  // Get request with the help of the Fetch API
  fetchFlights(
    from: string,
    to: string,
    departureDate: any,
    returnDate: any,
    adults: string,
    max: string
  ): Promise<Response> {
    return fetch(
      `http://localhost:5000/flight-search?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=${max}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
