//------------------------------------------- Open the database -------------------------------------------------//

const prompt = require('readline-sync').question; //prompt جعل الدالة تعمل في سطر الاوامر
const sqlite3 = require('sqlite3').verbose(); // استيراد وإعداد المكتبة اللازمة للتفاعل مع ملف قاعدة بيانات .
let db = new sqlite3.Database('DataBase', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('-------------------------------------------');
    
});

const fixText = (text) => text.split('').reverse().join(''); // للعكس النصوص


//------------------------------------------- للنفيذ المتسلسل للأوامر -------------------------------------------------//
/*db.serialize(() => {




  //------------------------------------------- CREATE TABLE Students -------------------------------------------------//
  db.run('CREATE TABLE Students (StudentID INTEGER PRIMARY KEY AUTOINCREMENT, StudentName TEXT ,StudentLastName TEXT, StudentAge INTEGER, StudentClass INTEGER,  StudentRegistrationDate TEXT);', function(err){
      if(err){
          return console.log(err.message);
      }
      console.log("Student table successfully created");
  });



  //------------------------------------------- CREATE TABLE Lessons -------------------------------------------------//
  db.run('CREATE TABLE Lessons(LessonID INTEGER PRIMARY KEY, LessonsName TEXT);', function(err){
      if(err){
          return console.log(err.message);
      }
      console.log("Lessons table successfully created");
  });
    db.run(`INSERT INTO Lessons (LessonID, LessonsName) VALUES (1, 'Python')`);
    db.run(`INSERT INTO Lessons (LessonID, LessonsName) VALUES (2, 'Ruby')`);
    db.run(`INSERT INTO Lessons (LessonID, LessonsName) VALUES (3, 'JavaScript')`);
    db.run(`INSERT INTO Lessons (LessonID, LessonsName) VALUES (4, 'C#')`);
    db.run(`INSERT INTO Lessons (LessonID, LessonsName) VALUES (5, 'php')`);


  //------------------------------------------- CREATE TABLE Student_Lessons -------------------------------------------------//
  db.run('CREATE TABLE Student_Lessons(StudentID INTEGER NOT NULL, LessonID INTEGER NOT NULL, PRIMARY KEY (StudentID, LessonID),  FOREIGN KEY (StudentID) REFERENCES Students (StudentID) ON DELETE CASCADE, FOREIGN KEY (LessonID) REFERENCES Lessons (LessonID) ON DELETE CASCADE);'
    , function(err){
      if(err){
          return console.log(err.message);
      }
      console.log("Student_Lessons timetable successfully created");
  });

})*/


let menuPrompt = ` الرجاء إدخال العملية التي ترغب في تنفيذها
* لإضافة طالب a
* لحذف طالب  d
* لتعديل معلومات طالب u
* لعرض معلومات طالب محدد s
* لعرض معلومات جميع الطلاب as
* للخروج من البرنامج اضغط ايش شيء اخر 
`
console.log(fixText(menuPrompt))

let choose = prompt("Enter the command: ")
switch(choose){
    case "a":
        add_student()
    break;
    case "d":
        delete_student()
    break;
    case "u":
        update_student()
    break;
    case "s":
        select_student()
    break;
    case "sa":
        select_student_all()
    break;
    
}


function add_student(){
    let student_name = prompt("Please enter the student's first name: ")
    let student_last_name = prompt("Please enter the student's last name: ")
    let student_age = prompt("Please enter the student's age: ")
    let student_class = prompt("Please enter the student's class: ")
    let Student_registration_date = prompt("Please enter the registration date: ")

    db.run(`INSERT INTO Students (StudentName, StudentLastName, StudentAge, StudentClass, StudentRegistrationDate) 
            VALUES (?, ?, ?, ?, ?)`,
            [student_name, student_last_name, student_age, student_class, Student_registration_date],
            function(err) {
                if (err) {
                    return console.log(err.message);
                }
                let new_studenti_d = this.lastID; // حفظ ال اي دي المولد تقائيا في جدول الطلاب
                console.log("The student has been added successfully");
                start_add_lessons(new_studenti_d)
    }); 
}


function start_add_lessons(student_id){
    let lesson_id = prompt("If you do not want to add lessons, enter no or enter a lesson ID from 1-5: ")
        // الخروج من الدالة باستخدام 'return'
        if (lesson_id.toLowerCase() === "no") {
            console.log("Student lessons have been successfully added"); // الرسالة الختامية المطلوبة
            db.close(function(err){
                if (err) return console.error(err.message);
                console.log('Close the database connection.')
                });                 
            return; 
        }
    // التحقق من وجود الدرس
    db.get(`SELECT LessonID FROM Lessons WHERE LessonID = ?`, [lesson_id],function(err, row){
            // التحقق من وجود خطأ اثناء الاتصال
        if(err){
            return console.log(err.message) ,start_add_lessons(student_id);
             
        }
        if (row) {
            // اضافة الدرس الى قاعدة البيانات
            db.run(`INSERT INTO Student_Lessons (StudentID, LessonID)
                VALUES(?, ?)`,
                [student_id, lesson_id],
                function(err){
                    if (err)  return console.log(err.message)
                    else {
                        console.log("Lesson added")
                    } 
                    start_add_lessons(student_id)
                });
            
        }
        else{
            console.log("This lesson does not exist")
            start_add_lessons(student_id);

        }
    });
}


function delete_student(){
    display_students_before_action(() => {
            let student_number = prompt("Please enter the student number you wish to delete: ")
            db.get(`SELECT StudentID FROM Students WHERE StudentID = ?`, [student_number],function(err, row){
                if(err) return console.log(err.message)
                if(row){
                    //Students حذف الطالب من جدول
                    db.run(`DELETE FROM Students WHERE StudentID = ?`,[student_number],function(err){
                        if(err){
                            return console.log(err.message);
                        }
                        console.log("The student has been successfully deleted")
                        db.close(function(err){
                            if (err) return console.error(err.message);
                            console.log('Close the database connection.')
                            });                
                    }); 
                }
                else{
                    console.log("Sorry, this student is not here.")
                }



            });            
    })


}


function update_student(){
    display_students_before_action(() =>  { 
        let Student_number_update = prompt("Please enter the student number whose information you want to edit: ")
        db.get(`SELECT * FROM Students WHERE StudentID = ?`, [Student_number_update],function(err, row){
            if(err) {
                return console.log(err.message)
            }
            //Students اذا الطالب موجود في جدول
            if(row){
                console.log("Current student information")
                console.log(row);
                console.log("Enter the student's new data; otherwise, leave it blank.")
                let student_name = prompt("Please enter the student's first name: ")
                if (student_name === "" || student_name.trim() === ""){ //trim() تسخدم هذه الدالة في حالة ادخل المستخدم فراغات فلا تحفظ وتبقى القيمة القديمة 
                    console.log("The previous value was retained.")
                }else{
                    db.run(`UPDATE Students SET StudentName = ? WHERE StudentID = ?`,[student_name, Student_number_update],function(err){
                        if (err) return console.log(err.message)

                    })

                }

                let student_last_name = prompt("Please enter the student's last name: ")
                if (student_last_name === "" || student_last_name.trim() === ""){
                    console.log("The previous value was retained.")
                }else{
                    db.run(`UPDATE Students SET StudentLastName = ? WHERE StudentID = ?`,[student_last_name, Student_number_update],function(err){
                        if (err) return console.log(err.message)
                    })

                }

                let student_age = prompt("Please enter the student's age: ")
                if (student_age === "" || student_age.trim() === ""){
                    console.log("The previous value was retained.")
                }else{
                    db.run(`UPDATE Students SET StudentAge = ? WHERE StudentID = ?`,[student_age, Student_number_update],function(err){
                        if (err) return console.log(err.message)

                    })

                }

                let student_class = prompt("Please enter the student's class: ")
                if (student_class === "" || student_class.trim() === ""){
                    console.log("The previous value was retained.")
                }else{
                    db.run(`UPDATE Students SET StudentClass = ? WHERE StudentID = ?`,[student_class, Student_number_update],function(err){
                        if (err) return console.log(err.message)
                    })

                }

                let Student_registration_date = prompt("Please enter the registration date: ") 
                if (Student_registration_date === "" || Student_registration_date.trim() === ""){
                    console.log("The previous value was retained.")
                }else{
                    db.run(`UPDATE Students SET StudentRegistrationDate = ? WHERE StudentID = ?`,[Student_registration_date, Student_number_update],function(err){
                        if (err) return console.log(err.message)
                        console.log("The update was successful");
                        db.close(function(err){
                            if (err) return console.error(err.message);
                            console.log('Close the database connection.')
                            });                    

                    })

                }
            }else{
                console.log("Sorry, this student is not here.")
            }


        });
    }); 

    
}

function select_student() {
display_students_before_action(function() {
            let student_number_display = prompt("Please enter the student number whose information you want to view: ");
            
            db.get(`SELECT * FROM Students WHERE StudentID = ?`, [student_number_display], function(err, row) {
                if (err) return console.log(err.message);
                if (row) {
                    console.log(row);
                    
                    db.all(`SELECT LessonID FROM Student_Lessons WHERE StudentID = ?`, [student_number_display], function(err, LessonID) {
                        if (err) return console.log(err.message);
                        
                        if (LessonID && LessonID.length > 0) { // تكون فيها كائن او مصفوفة من الكائنات في حالة تحقق الشرط
                            
                            const lessonIDs = LessonID.map(function(row) { // تقوم هذه الدالة بأخذ كائن في كل مرة من مصفوفة الكائنات 
                                return row.LessonID; // ترجع قيمة الخاصيةLessonID  
                            });
                            const id_list = lessonIDs.join(','); // تحويل من مصفوفة الى سلسلة نصية
                            
                            const sql = `SELECT LessonsName FROM Lessons WHERE LessonID IN (${id_list})`;

                            db.all(sql, [], function(err, lessonNames) {
                                if (err) return console.log(err.message);
                                
                                console.log("\n--- Registered Lessons ---");
                                lessonNames.forEach(lesson => { // تسخدم هذه الدالة للمرور على الكائنات من الاستعلام السابقforEach 
                                    console.log(`- ${lesson.LessonsName}`);
                                });
                                console.log("--------------------------");

                                db.close(function(err) { 
                                    if (err) return console.error(err.message);
                                    console.log('Close the database connection.');
                                }); 
                            }); 
                        } else {
                            console.log("The student has not yet registered for any Lesson.");
                            db.close(function(err) { 
                                if (err) return console.error(err.message);
                                console.log('Close the database connection.');
                            }); 
                        }
                    });
                } else {
                    console.log("Sorry, this student is not here.");
                }
            });
    });


}


function select_student_all(){
        db.all(`SELECT * FROM Students`,(err,table) => {
            if (err) return console.log(err.message)
            console.log(table)
    });
}


function display_students_before_action(callback) {
    console.log("List of registered students")
    db.all(`SELECT StudentID, StudentName FROM Students`, (err, rows) => {
        if (err) return console.log(err.message)
        console.log(rows); 
        callback(); 
    });
}



// إغلاق قاعدة البيانات
/*db.close(function(err){
    if (err) return console.error(err.message);
    console.log('Close the database connection.')

});*/
