
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.scss'],
  imports:[ReactiveFormsModule,CommonModule],
  standalone:true
})
export class InvestmentFormComponent implements OnInit {
  investmentForm: FormGroup;
  verifiedData:any
  isVerified:boolean=true
  isSubmit:boolean=false
  constructor(private fb: FormBuilder, private portfolioService: PortfolioService, private router:Router) {
    this.investmentForm = this.fb.group({
      assetType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onVerify() {
    if (this.investmentForm.valid) {
    this.isVerified=!this.isVerified
    this.isSubmit=!this.isSubmit
    this.verifiedData=this.investmentForm.value
    }
  }

  onSubmit() {
    if (this.investmentForm.valid) {
      this.portfolioService.addInvestment(this.investmentForm.value);
      this.investmentForm.reset();
      // this.isVerified=true
      // this.isSubmit=false
      this.router.navigateByUrl('dashboard')
    }
  }

  onCancel() {
    this.isVerified=true
    this.isSubmit=false
    }
}

