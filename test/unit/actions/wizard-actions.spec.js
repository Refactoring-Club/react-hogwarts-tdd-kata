import should from 'should';
import sinon from 'sinon';

import alt from "../../../src/alt";
import wizardActions from '../../../src/actions/wizard-actions';
import WizardRepository from '../../../src/repositories/wizard-repository';

var mockWizardRepository;

describe('wizard actions', () => {

  var dispatchedEvents;

  before(() => {
    alt.dispatcher.register((event) => {
      if (event.details.namespace == 'WizardActions') {
        dispatchedEvents.push(event);
      }
    });
  });

  beforeEach(() => {
    dispatchedEvents = [];
    mockWizardRepository = sinon.mock(WizardRepository);
  });

  describe('getWizard', () => {

    it('invokes updateWizard on success', (done) => {
      var wizard = {house: 'Slytherin', courses: []};
      mockWizardRepository.expects('get').once()
        .returns(new Promise((resolve) => { resolve(wizard); }));

      wizardActions.getWizard();

      setTimeout(() => {
        should(dispatchedEvents.length).equal(1);
        should(dispatchedEvents[0].details.name).equal('updateWizard');
        should(dispatchedEvents[0].data).equal(wizard);

        mockWizardRepository.verify();
        done();
      }, 10);
    });

    it('invokes updateWizardFailed on error', (done) => {
      var errorMessage = 'Test error message.';
      mockWizardRepository.expects('get').once()
        .returns(new Promise((resolve, reject) => { reject(errorMessage); }));

      wizardActions.getWizard();

      setTimeout((event) => {
        should(dispatchedEvents.length).equal(1);
        should(dispatchedEvents[0].details.name).equal('updateWizardFailed');
        should(dispatchedEvents[0].data).equal(errorMessage);

        mockWizardRepository.verify();
        done();
      }, 10);
    });

  });

  describe('registerForCourse', () => {

    it('invokes updateWizard on success', (done) => {
      var course = {id: 'course-1'};
      var wizard = {house: 'Slytherin', courses: []};
      var expectedWizard = {house: 'Slytherin', courses: [{id: 'course-1'}]};

      mockWizardRepository.expects('get').once()
        .returns(new Promise((resolve) => { resolve(wizard); }));
      mockWizardRepository.expects('save').once()
        .returns(new Promise((resolve) => { resolve(wizard); }));

      wizardActions.registerForCourse(course);

      setTimeout(() => {
        should(dispatchedEvents.length).equal(1);
        should(dispatchedEvents[0].details.name).equal('updateWizard');
        should(dispatchedEvents[0].data.house).equal(expectedWizard.house);
        should(dispatchedEvents[0].data.courses.length).equal(1);
        should(dispatchedEvents[0].data.courses[0]).equal(course);

        mockWizardRepository.verify();
        done();
      }, 10);
    });

    it('invokes registerForCourseFailed if get() fails', (done) => {
      var course = {id: 'course-1'};
      var errorMessage = 'Test error on get().';

      mockWizardRepository.expects('get').once()
        .returns(new Promise((resolve, reject) => { reject(errorMessage); }));

      wizardActions.registerForCourse(course);

      setTimeout(() => {
        should(dispatchedEvents.length).equal(1);
        should(dispatchedEvents[0].details.name).equal('registerForCourseFailed');
        should(dispatchedEvents[0].data).equal(errorMessage);

        mockWizardRepository.verify();
        done();
      }, 10);
    });

    it('invokes registerForCourseFailed if save() fails', (done) => {
      var course = {id: 'course-1'};
      var wizard = {house: 'Slytherin', courses: []};
      var errorMessage = 'Test error on save().';

      mockWizardRepository.expects('get').once()
        .returns(new Promise((resolve) => { resolve(wizard); }));
      mockWizardRepository.expects('save').once()
        .returns(new Promise((resolve, reject) => { reject(errorMessage); }));

      wizardActions.registerForCourse(course);

      setTimeout(() => {
        should(dispatchedEvents.length).equal(1);
        should(dispatchedEvents[0].details.name).equal('registerForCourseFailed');
        should(dispatchedEvents[0].data).equal(errorMessage);

        mockWizardRepository.verify();
        done();
      }, 10);
    });

  });

});
