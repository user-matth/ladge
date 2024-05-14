/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FineTuneComponent } from './fine-tune.component';

describe('FineTuneComponent', () => {
  let component: FineTuneComponent;
  let fixture: ComponentFixture<FineTuneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FineTuneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FineTuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
