import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPanelCardComponent } from './currency-panel-card.component';

describe('CurrencyPanelCardComponent', () => {
  let component: CurrencyPanelCardComponent;
  let fixture: ComponentFixture<CurrencyPanelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyPanelCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyPanelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
