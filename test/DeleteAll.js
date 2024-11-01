import { Selector } from 'testcafe';

fixture("ToDo Test")
    .page("https://test.vrinceanucatalina.com/todo/");

    

test('Delete All Tasks', async t => {
   

    await t
       //Arrange
       
       .typeText(Selector('#task-input'), "New Task")
       .typeText(Selector('#start-date'), "2024-11-01")
       .typeText(Selector('#end-date'), "2024-11-03")
       .click(Selector('#task-priority')) // Click to open dropdown
       .click(Selector('#priority').withText("Low")) // Select the priority option
       
       .click(Selector('button').withText('Add Task'))
      
       .expect(Selector('li.task').exists).eql(true, { timeout: 5000 });

         //Act

    await t
        .click(Selector('button').withText('Delete All'))

        //Assert
        .expect(Selector('li.task').exists).eql(false, { timeout: 5000 });
       

        
        
});