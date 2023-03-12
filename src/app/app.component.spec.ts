import 'zone.js'
import 'zone.js/testing'
import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {KissService} from "./kiss.service";
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
/*
What we can do in tests       VS   What we can do in app.component.ts
 fixture.componentInstance   <-->   new AppComponent()
 fixture.elementRef          <-->   constructor(elementRef: ElementRef)
 fixture.nativeElement       <-->   elementRef.nativeElement
 fixture.changeDetectorRef() <-->   constructor(changeDetectorRef: ChangeDetectorRef)
 fixture.detectChanges()     <-->   changeDetectorRef.detectChanges()
 fixture.checkNoChanges()    <-->   changeDetectorRef.checkNoChanges()
 fixture.autoDetectChanges() <-->   automatically detects changes
*/

describe('App DOM Testing',() => {
  // Setup

  // Instance of AppComponent
  let component: AppComponent

  /*
  The 'fixture' is a test harness for interacting with the created component and
  its corresponding element (https://angular.io/guide/testing-components-basics#componentfixture)

  Fixture utilities:
   fixture.componentRef - Access to injector
   fixture.destroy() - Trigger component destruction
   fixture.isStable() - Boolean whether fixture has async tasks that have not been completed yet
   fixture.whenStable() - Promise that resolves when fixture is stable
   fixture.whenRenderingDone() - Promise that resolves when UI animations have finished animating
   */
  let fixture: ComponentFixture<AppComponent>

  // "Compiles" AppComponent by using 'TestBed' (Declares, instantiates, and renders the component)
  // TestBed facilitates component tests that are testing how the component interacts with the DOM
  beforeEach(async () => { // We use async because compileComponents is asynchronous (returns a Promise)
      await TestBed.configureTestingModule(
        // Mocks the NgModule
        {
        declarations: [
          AppComponent
        ],

        imports: [
          BrowserModule,
          FormsModule
        ],

      }).compileComponents();

      // Creates instance of AppComponent, renders to DOM, and returns component 'fixture'
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance
  });

  // Tests
  it('should create the app', () => {
    // Assertion
    expect(component).toBeDefined();
  });

  it('should have title binded', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('#rocket-title')

    // Must call detectChanges() before testing data binding between DOM and component
    fixture.detectChanges()

    // Assertion
    expect(h1?.textContent).toBeTruthy()
    expect(h1.textContent).toContain(component.title)
  })

  it('should have input binded', () => {
    fixture.detectChanges()
    const rocketInput: HTMLInputElement = fixture.nativeElement.querySelector('#rocket-input')

    // Simulate user typing
    const sampleText = 'I am typing foo bar'

    // Must dispatch DOM event so that Angular learns of the value change
    rocketInput.value = sampleText
    rocketInput.dispatchEvent(new Event('input'))

    fixture.detectChanges()

    // Assertion
    expect(component.inputValue).toBe(sampleText)
  })
})

describe('Automatic change detection',() => {
  // Setup
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      {
        declarations: [
          AppComponent
        ],

        // 1. Import and Add ComponentFixtureAutoDetect provider with useValue: true
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true}
        ]

      }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance
  });

  // Tests
  it('should have title binded', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('#rocket-title')

    // fixture.detectChanges() // This is optional now. We can comment it out.

    // Assertion
    expect(h1?.textContent).toBeTruthy()
    expect(h1.textContent).toContain(component.title)
  })

  it('should have title binded after title change', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('#rocket-title')
    component.title = 'README'

    fixture.detectChanges() // This is needed now.

    // Assertion
    expect(h1?.textContent).toBeTruthy()
    expect(h1.textContent).toContain(component.title)
  })
})

class KissServiceStub {
  kiss() {
    console.log('Stubbed kiss')
  }
}

describe('Components with dependencies',() => {
  // Setup
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  let kissStub: KissService

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      {
        declarations: [
          AppComponent
        ],

        // Stub KissService with useClass
        providers: [
          { provide: KissService, useClass: KissServiceStub}
        ]

      }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance

    kissStub = TestBed.inject(KissService)
  });

  // Tests
  it('should create the app', () => {
    // Assertion
    expect(component).toBeDefined();
  });

  it('should call KissService on click', () => {
    // Spy setup
    const kissSpy = jest.spyOn(kissStub, 'kiss')

    component.onClick()

    fixture.detectChanges()

    // Assertion
    expect(component).toBeDefined();
    expect(kissSpy).toHaveBeenCalled()
  });
})
