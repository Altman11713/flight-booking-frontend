import { FlightSearchService } from './../../services/flight-search.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FlightSearchComponent implements OnInit {
  public loading: boolean = false;
  public myError: any = '';
  public fromLocation: string = '';
  public toLocation: string = '';
  public departureDate: any = '';
  public returnDate: any = '';
  public nrOfAdults: number = 0;
  public flightsTotal: any;
  public maxNrOfFlights: number = 0;

  // Form validators
  public startingLocationFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(3),
  ]);
  public destinationLocationFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(3),
  ]);
  public departureDateFormControl = new FormControl('', [Validators.required]);
  public returnDateFormControl = new FormControl('', [Validators.required]);
  public numberOfAdultsFormControl = new FormControl('', [Validators.required]);
  public maxNrOfFlightsFormControl = new FormControl('', [Validators.required]);

  constructor(private flightSearchService: FlightSearchService) {}

  ngOnInit(): void {}

  // Alert confirmation for page reload
  confirmAction() {
    let confirmAction = confirm(
      'An internal server error has occurred! Would you like to reload the page?'
    );
    if (confirmAction) {
      location.reload();
    } else {
      alert('Page will not be reloaded.');
    }
  }

  // Disables search button based on form validation and loading data status
  buttonDisabledStatus(): boolean {
    if (
      this.startingLocationFormControl.invalid ||
      this.destinationLocationFormControl.invalid ||
      this.departureDateFormControl.invalid ||
      this.returnDateFormControl.invalid ||
      this.numberOfAdultsFormControl.invalid ||
      this.maxNrOfFlightsFormControl.invalid
    ) {
      return true;
    } else if (this.loading) {
      return true;
    }
    return false;
  }

  // Fetching flights with the help of the flight-search.service.ts
  onFindFlights() {
    this.loading = true;

    this.flightSearchService
      .fetchFlights(
        this.fromLocation,
        this.toLocation,
        this.departureDate,
        this.returnDate,
        this.nrOfAdults.toString(),
        this.maxNrOfFlights.toString()
      )
      .then((response) => {
        // Uncomment for debugging
        // console.log(response.status);
        if (response.status === 200) {
          response.json().then((data) => {
            if (data.data === undefined || data.data.length === 0) {
              alert(
                'No flights have been found, please try again with new data!'
              );
            }
            this.loading = false;
            this.flightsTotal = data.data;
            // Uncomment for debugging
            // console.log(this.flightsTotal);
          });
        } else if (response.status === 400 || response.status === 500) {
          this.loading = false;
          this.confirmAction();
        } else if (response.status === 404) {
          this.loading = false;
          alert(
            'No results matching your request have been found, please try again with new data!'
          );
        }
      })
      .catch((error) => {
        this.loading = false;
        this.myError = error;
        alert(error);
        // Uncomment for debugging
        // console.log(error);
      });
  }
}
