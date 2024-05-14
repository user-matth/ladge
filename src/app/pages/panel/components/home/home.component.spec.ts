/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PanelHomeComponent } from './home.component';

describe('PanelHomeComponent', () => {
  let component: PanelHomeComponent;
  let fixture: ComponentFixture<PanelHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
