import { Component, OnInit, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from 'd3';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Analyses & Business Intelligence</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Revenue Chart -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white lg:col-span-2">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Évolution du Chiffre d'Affaires (Millions FG)</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <div #chartContainer class="h-64 w-full"></div>
          </mat-card-content>
        </mat-card>

        <!-- Top Products -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Plats les plus vendus</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <div class="space-y-4">
              @for (item of topProducts; track item.name) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-xs font-bold text-jacquier-gold">
                      #{{ $index + 1 }}
                    </div>
                    <span class="text-sm">{{ item.name }}</span>
                  </div>
                  <span class="text-xs font-bold text-gray-400">{{ item.sales }} ventes</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Customer Satisfaction -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Satisfaction Client</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4 flex flex-col items-center">
            <div class="text-5xl font-serif font-bold text-jacquier-gold mb-2">4.8</div>
            <div class="flex gap-1 text-jacquier-gold mb-4">
              <mat-icon>star</mat-icon>
              <mat-icon>star</mat-icon>
              <mat-icon>star</mat-icon>
              <mat-icon>star</mat-icon>
              <mat-icon>star_half</mat-icon>
            </div>
            <p class="text-xs text-gray-500 text-center">Basé sur 124 avis ce mois-ci</p>
          </mat-card-content>
        </mat-card>

        <!-- Occupancy Rate -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Taux d'Occupation</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4 flex flex-col items-center">
            <div class="text-5xl font-serif font-bold text-green-500 mb-2">72%</div>
            <p class="text-xs text-gray-500 text-center">Moyenne hebdomadaire</p>
            <div class="w-full bg-gray-800 h-1 rounded-full mt-6 overflow-hidden">
              <div class="bg-green-500 h-full w-[72%]"></div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  topProducts = [
    { name: 'Filet de Capitaine', sales: 450 },
    { name: 'Poulet Yassa de Luxe', sales: 380 },
    { name: 'Riz Gras Royal', sales: 310 },
    { name: 'Mousse au Chocolat', sales: 240 },
    { name: 'Cocktail Jacquier', sales: 190 },
  ];

  revenueData = [
    { date: new Date(2023, 0, 1), value: 120 },
    { date: new Date(2023, 1, 1), value: 150 },
    { date: new Date(2023, 2, 1), value: 140 },
    { date: new Date(2023, 3, 1), value: 180 },
    { date: new Date(2023, 4, 1), value: 210 },
    { date: new Date(2023, 5, 1), value: 190 },
    { date: new Date(2023, 6, 1), value: 250 },
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(this.revenueData, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.revenueData, d => d.value) as number])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('color', '#444');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#444');

    const line = d3.line<any>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.revenueData)
      .attr('fill', 'none')
      .attr('stroke', '#D4AF37')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    svg.selectAll('.dot')
      .data(this.revenueData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', '#D4AF37');
  }
}
