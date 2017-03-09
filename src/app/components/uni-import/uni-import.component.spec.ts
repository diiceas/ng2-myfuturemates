/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UniImportComponent } from './uni-import.component';

describe('UniImportComponent', () => {
  let component: UniImportComponent;
  let fixture: ComponentFixture<UniImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
