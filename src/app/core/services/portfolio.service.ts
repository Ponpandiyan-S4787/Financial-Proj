import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Investment {
  assetType: string;
  quantity: number;
  purchasePrice: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private investments = new BehaviorSubject<Investment[]>([]);
  private portfolioData = new BehaviorSubject<any>({ totalValue: 0, performance: 0 });

  getInvestments(): Observable<Investment[]> {
    return this.investments.asObservable();
  }

  addInvestment(investment: Investment) {
    const current = this.investments.getValue();
    this.investments.next([...current, investment]);
    this.updatePortfolioData();
  }

  getPortfolioData(): Observable<any> {
    return this.portfolioData.asObservable();
  }

  private updatePortfolioData() {
    const investments = this.investments.getValue();
    const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);
    const performance = investments.length > 0 ? totalValue / investments.length : 0;
    this.portfolioData.next({ totalValue, performance, investments });
  
  }
}