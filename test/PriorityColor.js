import { Selector } from 'testcafe';

fixture("ToDo Test")
    .page("https://test.vrinceanucatalina.com/todo/");

    

test('Priority Color', async t => {
   

    await t
       //Arrange
       
       .typeText(Selector('#task-input'), "High Priority Task")
       .typeText(Selector('#start-date'), "2024-11-01")
       .typeText(Selector('#end-date'), "2024-11-03")
       .click(Selector('#task-priority')) // Click to open dropdown
       .click(Selector('#priority').withText("High")) // Select the priority option
        //Act
       .click(Selector('button').withText('Add Task'))
      //Assert
       .expect(Selector('li.task').getStyleProperty('background-color')).eql("rgb(255, 111, 97)");

        
});