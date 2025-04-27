import { Component } from '@angular/core';
import { FirebaseService } from '../../services/entertainment.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-entertainment',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.css']
})
export class EntertainmentComponent {
  newMovie = {
    title: '',
    releaseYear: 0,
    hero: '',
    watchDate: ''
  };

  watchlistMovies: Observable<any[]>;  // Observable for watchlist movies
  showWatchlist = false;              // Flag to show or hide watchlist
  watchDateInput = '';                // For storing user input date

  constructor(private firebaseService: FirebaseService) {
    // Subscribe to the watchlist collection to display movies
    this.watchlistMovies = this.firebaseService.getWatchlistMovies();
  }

  // Add movie to watchlist
  addToWatchlist(movie:any) {
    const watchDate = prompt('Please enter the watch date (YYYY-MM-DD):');
    if (watchDate) {
      this.firebaseService.addToWatchlist({
        title: movie.title,
        releaseYear: movie.releaseYear,
        hero: movie.hero,
        watchDate: watchDate
      }).then(() => {
        alert('Movie added to your watchlist!');
      }).catch((error) => {
        console.error('Error adding movie to watchlist:', error);
      });
    }
  }

  // Toggle view of watchlist
  showWatchlistMovies() {
    this.showWatchlist = !this.showWatchlist;
  }
  toggleWatchlistView() {
    this.showWatchlist = !this.showWatchlist;
  }
  // List of Movies/Web Series
  movies = [
    { title: 'RRR', releaseYear: 2022, hero: 'Ram Charan, Jr. NTR', watchDate: '2023-05-10', rating: 8.5, ottPlatform: 'Netflix', director: 'S. S. Rajamouli', runtime: '187 min' },
    { title: 'Baahubali: The Beginning', releaseYear: 2015, hero: 'Prabhas', watchDate: '2023-06-15', rating: 8.0, ottPlatform: 'Amazon Prime', director: 'S. S. Rajamouli', runtime: '159 min' },
    { title: 'Baahubali: The Conclusion', releaseYear: 2017, hero: 'Prabhas', watchDate: '2023-08-20', rating: 8.3, ottPlatform: 'Amazon Prime', director: 'S. S. Rajamouli', runtime: '167 min' },
    { title: 'Ala Vaikunthapurramuloo', releaseYear: 2020, hero: 'Allu Arjun', watchDate: '2023-09-10', rating: 7.6, ottPlatform: 'Netflix', director: 'Trivikram Srinivas', runtime: '167 min' },
    { title: 'Pushpa: The Rise', releaseYear: 2021, hero: 'Allu Arjun', watchDate: '2023-10-15', rating: 7.8, ottPlatform: 'Amazon Prime', director: 'Sukumar', runtime: '179 min' },
    { title: 'Magadheera', releaseYear: 2009, hero: 'Ram Charan', watchDate: '2023-11-20', rating: 7.9, ottPlatform: 'Disney+ Hotstar', director: 'S. S. Rajamouli', runtime: '159 min' },
    { title: 'Srimanthudu', releaseYear: 2015, hero: 'Mahesh Babu', watchDate: '2023-12-10', rating: 7.8, ottPlatform: 'Netflix', director: 'Koratala Siva', runtime: '158 min' },
    { title: 'Khaidi No. 150', releaseYear: 2017, hero: 'Chiranjeevi', watchDate: '2023-12-15', rating: 7.5, ottPlatform: 'Amazon Prime', director: 'V. V. Vinayak', runtime: '151 min' },
    { title: 'Sye Raa Narasimha Reddy', releaseYear: 2019, hero: 'Chiranjeevi', watchDate: '2023-12-25', rating: 7.6, ottPlatform: 'Amazon Prime', director: 'Surender Reddy', runtime: '162 min' },
    { title: 'Jersey', releaseYear: 2019, hero: 'Nani', watchDate: '2024-01-10', rating: 8.3, ottPlatform: 'Netflix', director: 'Gowtham Tinnanuri', runtime: '172 min' },
    { title: 'Eega', releaseYear: 2012, hero: 'Nani', watchDate: '2024-02-20', rating: 7.7, ottPlatform: 'Netflix', director: 'S. S. Rajamouli', runtime: '135 min' },
    { title: 'Baadshah', releaseYear: 2013, hero: 'NTR Jr.', watchDate: '2024-03-15', rating: 7.0, ottPlatform: 'Amazon Prime', director: 'Sreenu Vaitla', runtime: '154 min' },
    { title: 'Rangasthalam', releaseYear: 2018, hero: 'Ram Charan', watchDate: '2024-04-05', rating: 8.1, ottPlatform: 'Amazon Prime', director: 'Sukumar', runtime: '179 min' },
    { title: 'Maharshi', releaseYear: 2019, hero: 'Mahesh Babu', watchDate: '2024-05-10', rating: 7.5, ottPlatform: 'Amazon Prime', director: 'Vamshi Paidipally', runtime: '174 min' },
    { title: 'Vakeel Saab', releaseYear: 2021, hero: 'Pawan Kalyan', watchDate: '2024-06-15', rating: 7.1, ottPlatform: 'Amazon Prime', director: 'Venu Sriram', runtime: '145 min' },
    { title: 'F2: Fun and Frustration', releaseYear: 2019, hero: 'Venkatesh, Varun Tej', watchDate: '2024-07-20', rating: 7.0, ottPlatform: 'Netflix', director: 'Anil Ravipudi', runtime: '150 min' },
    { title: 'Nannaku Prematho', releaseYear: 2016, hero: 'NTR Jr.', watchDate: '2024-08-15', rating: 7.2, ottPlatform: 'Amazon Prime', director: 'Sukumar', runtime: '167 min' },
    { title: 'Bharat Ane Nenu', releaseYear: 2018, hero: 'Mahesh Babu', watchDate: '2024-09-10', rating: 7.5, ottPlatform: 'Amazon Prime', director: 'Korata Siva', runtime: '173 min' },
    { title: 'Kajal Aggarwal', releaseYear: 2020, hero: 'Nithiin', watchDate: '2024-10-05', rating: 6.5, ottPlatform: 'Netflix', director: 'Krishna Vijay L', runtime: '158 min' },
    { title: 'Baahubali', releaseYear: 2015, hero: 'Prabhas', watchDate: '2024-12-05', rating: 8.0, ottPlatform: 'Amazon Prime', director: 'S.S Rajamouli', runtime: '159 min' },
    { title: 'Temper', releaseYear: 2015, hero: 'NTR Jr.', watchDate: '2025-01-10', rating: 7.4, ottPlatform: 'Amazon Prime', director: 'Puri Jagannadh', runtime: '155 min' },
    { title: 'Bhaagamathie', releaseYear: 2018, hero: 'Anushka Shetty', watchDate: '2025-02-15', rating: 7.6, ottPlatform: 'Amazon Prime', director: 'G. Ashok', runtime: '132 min' },
    { title: 'Samantha Ruth Prabhu', releaseYear: 2020, hero: 'Naga Chaitanya', watchDate: '2025-03-10', rating: 7.3, ottPlatform: 'Disney+ Hotstar', director: 'Siva Nirvana', runtime: '140 min' },
    { title: 'Jathi Ratnalu', releaseYear: 2021, hero: 'Naveen Polishetty', watchDate: '2025-04-25', rating: 8.0, ottPlatform: 'Amazon Prime', director: 'Kalyan Shankar', runtime: '129 min' },
    { title: 'Uppena', releaseYear: 2021, hero: 'Vaisshnav Tej', watchDate: '2025-05-05', rating: 7.4, ottPlatform: 'Netflix', director: 'Buchi Babu Sana', runtime: '146 min' },
    { title: 'Aacharya', releaseYear: 2021, hero: 'Chiranjeevi', watchDate: '2025-06-10', rating: 5.8, ottPlatform: 'Amazon Prime', director: 'Korata Siva', runtime: '140 min' },
    { title: 'Alludu Adhurs', releaseYear: 2021, hero: 'Bellamkonda Srinivas', watchDate: '2025-07-20', rating: 6.2, ottPlatform: 'Netflix', director: 'K. S. Ravindra', runtime: '160 min' },
    { title: 'Naa Peru Surya', releaseYear: 2018, hero: 'Allu Arjun', watchDate: '2025-08-10', rating: 7.1, ottPlatform: 'Amazon Prime', director: 'Vakkantam Vamsi', runtime: '164 min' },
    { title: 'Kshana Kshana', releaseYear: 1991, hero: 'Venkatesh', watchDate: '2025-09-15', rating: 7.5, ottPlatform: 'Disney+ Hotstar', director: 'Raghavendra Rao', runtime: '157 min' },
    { title: 'Chalo', releaseYear: 2018, hero: 'Naga Shaurya', watchDate: '2025-10-15', rating: 7.7, ottPlatform: 'Netflix', director: 'Venky Kudumula', runtime: '150 min' },
    { title: 'Pelli Sandadi', releaseYear: 1996, hero: 'Srikanth', watchDate: '2025-11-10', rating: 7.2, ottPlatform: 'Amazon Prime', director: 'K. Raghavendra Rao', runtime: '139 min' },
    { title: 'Sundarakanda', releaseYear: 1992, hero: 'Venkatesh', watchDate: '2025-12-25', rating: 7.5, ottPlatform: 'Disney+ Hotstar', director: 'K. Raghavendra Rao', runtime: '147 min' },
    { title: 'Fidaa', releaseYear: 2017, hero: 'Varun Tej, Sai Pallavi', watchDate: '2026-01-05', rating: 7.8, ottPlatform: 'Amazon Prime', director: 'Sekhar Kammula', runtime: '149 min' },
    { title: 'Duvvada Jagannadham', releaseYear: 2017, hero: 'Allu Arjun', watchDate: '2026-02-10', rating: 7.0, ottPlatform: 'Amazon Prime', director: 'Harish Shankar', runtime: '151 min' },
    { title: 'Karthikeya 2', releaseYear: 2022, hero: 'Nikhil Siddharth', watchDate: '2026-03-05', rating: 7.8, ottPlatform: 'Zee5', director: 'Chandoo Mondeti', runtime: '145 min' },
    { title: 'Bheemla Nayak', releaseYear: 2022, hero: 'Pawan Kalyan, Rana Daggubati', watchDate: '2026-04-25', rating: 7.5, ottPlatform: 'Disney+ Hotstar', director: 'Saagar K Chandra', runtime: '121 min' },
    { title: 'Master', releaseYear: 2021, hero: 'Vijay', watchDate: '2026-05-15', rating: 7.4, ottPlatform: 'Amazon Prime', director: 'Lokesh Kanagaraj', runtime: '178 min' },
    { title: 'Satyam Shivam Sundaram', releaseYear: 2021, hero: 'Sree Vishnu', watchDate: '2026-06-10', rating: 7.6, ottPlatform: 'Zee5', director: 'Sree Vishnu', runtime: '144 min' }
  ];
  
}
