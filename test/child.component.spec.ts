import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, NgModule } from '@angular/core';
import { SharkTableComponent, SharkDynamicContents, SharkChildComponent, SharkTableUtils } from '../src';
import { SharkDynamicContentsDirective } from '../src/dynamic/dynamic.contents.directive';

describe('SharkTableComponent', () => {

  let fixture: ComponentFixture<SharkChildComponent>;
  let component: SharkChildComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ChildComponentTestModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharkChildComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should contain custom rendering for child row', () => {
    component.component = TestBed.createComponent(ChildDataComponent).componentRef.componentType;
    component.row = {col1: '1', col2: 'b', col3: 'c' };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tr').innerHTML).toEqual('<td>1</td><td>b</td><td>c</td>');
  });

});

@Component({
  template: `
    <table>
      <tr><td>{{ data.col1 }}</td><td>{{ data.col2 }}</td><td>{{ data.col3 }}</td></tr>
    </table>
  `
})
export class ChildDataComponent implements SharkDynamicContents {
  data: any;
}

@NgModule({
  exports: [ ChildDataComponent, SharkChildComponent, SharkDynamicContentsDirective ],
  declarations: [ ChildDataComponent, SharkChildComponent, SharkDynamicContentsDirective ],
  providers: [ SharkTableUtils ],
  entryComponents: [ ChildDataComponent ]
})
export class ChildComponentTestModule {
}