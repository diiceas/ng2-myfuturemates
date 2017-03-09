/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JoinuniComponent } from './joinuni.component';

describe('JoinuniComponent', () => {
  let component: JoinuniComponent;
  let fixture: ComponentFixture<JoinuniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinuniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinuniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
