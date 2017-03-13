/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FbComponent } from './fb.component';

describe('FbComponent', () => {
  let component: FbComponent;
  let fixture: ComponentFixture<FbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
