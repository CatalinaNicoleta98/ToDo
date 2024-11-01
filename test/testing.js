import { Selector } from 'testcafe';

fixture("ToDo Test")
    .page("https://test.vrinceanucatalina.com/todo/"); 

test('Add Task', async t => {
   

    await t
       //Arrange
        .typeText(Selector('#task-input'), "New Task")
        .typeText(Selector('#start-date'), "2024-10-10")
        .typeText(Selector('#end-date'), "2024-10-12")
        .click(Selector('#task-priority')) // Click to open dropdown
        .click(Selector('#priority').withText("Low")) // Select the priority option
        //Act
        .click(Selector('button').withText('Add Task'))
       //Assert
        .expect(Selector('li.task').exists).eql(true);
        
        
});

test('Toggle Dark Mode', async t => {
    // Ensure the initial state is light mode
    await t
        //Assert
        .expect(Selector('body').hasClass('dark-mode')).eql(false)
        //Act
        .click(Selector('#dark-mode-toggle'))
        //Assert
        .expect(Selector('body').hasClass('dark-mode')).eql(true)
        //Act
        .click(Selector('#dark-mode-toggle'))
        //Assert
        .expect(Selector('body').hasClass('dark-mode')).eql(false);
});


