//------------------------------------------- Open the database -------------------------------------------------//
const inquirer = require('inquirer'); // لاستقبال المدخلات والتحقق منها
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

// ------------------------------------
// 1. // التحقق من مدخلات المستخدم من عدم وجود فراغ و سلسلة نصية ورقم عشري ورقم سالب أو يساوي الصفر
// ------------------------------------
function Check_of_number(message) {
    let input;
    do {

        input = prompt(message).trim(); //لتنظيف المسافات
        if (input === "") {
            return ""
        }
        const num = parseInt(input); // تحويل السلسلة النصية الى عدد صحيح غير عشري فاذا لم تجد رقم مثلا وجدت رقم و سلسلة نصية فارغة ترجع NaN
        
        if (!isNaN(num) && String(num) === input && num > 0) {
            return num; 
        }
        
        let ErrorMessage = "❌ خطأ في المدخل يجب أن يكون رقما موجبا فقط لايحتوي على نصوص ولارموز ";
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        console.log(fixText(ErrorMessage))
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        

    } while (true);
}

// ------------------------------------
// 2. التحقق من النصوص ألا تحتوي على أرقام أو فراغات)
// ------------------------------------
function Check_of_text(message) {
    let input;
    do {
        input = prompt(message).trim(); 

        if (input === "") {
            return ""
        }
        
        
        // التحقق: غير فارغ ولا يحتوي على أي رقم (/\d/.test)
        if (/^[a-zA-Z]+$/.test(input)) { // تقوم هذه الدلةtest بارجاع true اذا كان المدخل رقما أو false اذا كان لايوجد فيه رقما 
            return input; 
        }
        
        let ErrorMessage = "❌ خطأ في المدخل يجب ان يكون نصا بلغة الأنجليزية فقط ولا يحتوي على أرقام أرموز ";
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        console.log(fixText(ErrorMessage))
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
    } while (true);
}

// ------------------------------------
// 3. التحقق من التاريخ بحيث يكون بصيغة واضحة للمتسخدم 
// ------------------------------------
function Check_of_date(message) {
    let input;
    const date_regex = /^\d{4}-\d{2}-\d{2}$/; // الصيغة: YYYY-MM-DD
    const Text_format = "(Please write the date like this: YYYY-MM-DD):";
    
    do {
        input = prompt(message + Text_format).trim();
        if (input === "") {
            return ""
        }        
        if (date_regex.test(input)) {
            return input;
        }
        
        let ErrorMessage = "❌ خطأ في المدخل يجب أن يكون الإدخال هكذا DD-MM-YYYY";
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        console.log(fixText(ErrorMessage))
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

    } while (true);
}

function add_student(){
    console.log("-------------------")    
    console.log("--- Add sudent ----")
    let student_name = Check_of_text("Please enter the student's first name: ")
    let student_last_name = Check_of_text("Please enter the student's last name: ")
    let student_age = Check_of_number("Please enter the student's age: ")
    let student_class = Check_of_number("Please enter the student's class: ")
    let Student_registration_date = Check_of_date("Please enter the registration date: ")

    db.run(`INSERT INTO Students (StudentName, StudentLastName, StudentAge, StudentClass, StudentRegistrationDate) 
            VALUES (?, ?, ?, ?, ?)`,
            [student_name, student_last_name, student_age, student_class, Student_registration_date],
            function(err) {
                if (err) {
                    return console.log(err.message);
                }
                let new_studenti_Id = this.lastID; // حفظ ال اي دي المولد تقائيا في جدول الطلاب
                let studentAdded = "تمت إضافة الطالب بنجاح";
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-")
                console.log(fixText(studentAdded))
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-")
                start_add_lessons(new_studenti_Id)
    }); 
}


function start_add_lessons(student_id){
    display_lessons_before_action(() => {
        let lesson_id = prompt("If you do not want to add lessons, enter no or enter a lesson ID from 1-5: ")

            // الخروج من الدالة باستخدام 'return'
            if (lesson_id.toLowerCase() === "no") {
                let lessonAdded = "تمت إضافة دروس الطالب بنجاح";// الرسالة الختامية المطلوبة
                console.log("+-+-+-+-+-+-+-+-+-+-+-+-+--+-")
                console.log(fixText(lessonAdded))
                console.log("+-+-+-+-+-+-+-+-+-+-+-+-+--+-")
                db.close(function(err){
                    if (err) return console.error(err.message);
                    console.log('Close the database connection.')
                    });                 
                return; 
            }        
    
        // التحقق من وجود الدرس
        db.get(`SELECT LessonID FROM Lessons WHERE LessonID = ?`, [lesson_id],function(err, lessonExist){
            if(err){// التحقق من وجود خطأ اثناء الاتصال

                return console.log(err.message) ,start_add_lessons(student_id);
                
            }
            if (lessonExist) {//  اذا الدرس موجود في جدول الدروس 
                db.get(`SELECT * FROM Student_Lessons WHERE StudentID = ? AND LessonID = ?`, [student_id, lesson_id], function(err, registered) {
                    if (err) return console.log(err.message), start_add_lessons(student_id);
                    if(!registered){ // اذا الطالب لم يسجل في الدرس بعد
                        db.run(`INSERT INTO Student_Lessons (StudentID, LessonID) 
                            VALUES(?, ?)`, // اضافة الدرس في قاعدة البيانات
                            [student_id, lesson_id],
                            function(err){
                                if (err)  return console.log(err.message)
                                else {
                                    console.log("-+-+-+-+-+-+")
                                    let LessonAdded = "تم اضافة الدرس";
                                    console.log(fixText(LessonAdded))
                                    console.log("-+-+-+-+-+-+")                                    
                                } 
                                start_add_lessons(student_id)
                            });
                                        

                    } else{ // اذا طالب مسجل في الدرس بالفعل
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")                        
                        let alreadyRegistered = "الطالب مسجل في الدرس بالفعل اختر درس اخر";
                        console.log(fixText(alreadyRegistered))
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")                          
                        start_add_lessons(student_id)
                    }
                });

                
            }
            else{ // اذا الدرس غير موجود في جدول الدروس
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+")                          
                let lessonNotExist = "هذا الدرس غير موجود اختر درس اخر";
                console.log(fixText(lessonNotExist))
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+")                          

                start_add_lessons(student_id);

            }
        });
    })
}


function delete_student(){
    console.log("-----------------------")      
    console.log("--- Delete student ----")
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
                    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                    let studentNotHere = "عذرا لايوجد طالب له هذا المعرف لحذفه الرجاء اعد تشغيل البرنامج";
                    console.log(fixText(studentNotHere))
                    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                }



            });            
    })


}


function update_student() {
    console.log("-----------------------")
    console.log("--- Update student ----")
    display_students_before_action(() => {
        let Student_number_update = prompt("Please enter the student number whose information you want to edit: ")
        
        // جلب البيانات الحالية للطالب
        db.get(`SELECT * FROM Students WHERE StudentID = ?`, [Student_number_update], function(err, row) {
            if (err) {
                return console.log(err.message)
            }
            
            // إذا وجدنا الطالب
            if (row) {
                let oldData = "معلومات الطالب الحالية";
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                console.log(fixText(oldData))
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                console.log(row); // عرض البيانات القديمة
                
                let NewStudentData = "أدخل بيانات الطالب الجديدة، والا اضغط انتر لتبقى القيمة السابقة ";
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                console.log(fixText(NewStudentData))
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

                // 1. استقبال المدخلات (دون الاتصال بقاعدة البيانات الآن)
                let input_name = Check_of_text("Please enter the student's first name: ");
                let input_lastName = Check_of_text("Please enter the student's last name: ");
                let input_age = Check_of_number("Please enter the student's age: ");
                let input_class = Check_of_number("Please enter the student's class: ");
                let input_date = Check_of_date("Please enter the registration date: ");

                // 2. تجهيز البيانات النهائية (الجديدة أو الاحتفاظ بالقديمة)
                //  (إذا كان المدخل فارغ ؟ خذ القديم من row : وإلا خذ المدخل الجديد)
                let final_Name = (input_name === "") ? row.StudentName : input_name;
                let final_LastName = (input_lastName === "") ? row.StudentLastName : input_lastName;
                let final_Age = (input_age === "") ? row.StudentAge : input_age;
                let final_Class = (input_class === "") ? row.StudentClass : input_class;
                let final_Date = (input_date === "") ? row.StudentRegistrationDate : input_date;

                // طباعة رسالة للمستخدم إذا تم الاحتفاظ بالقيم
                if(input_name === "" && input_lastName === "" && input_age === "" && input_class === "" && input_date === "") {
                    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                    console.log(fixText("لم يتم تغيير أي بيانات"));
                    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                    db.close(); 
                    return;     
                }

                // 3. تنفيذ تحديث واحد شامل (ONE Update Statement) 



                // هذا يمنع مشكلة Database Locked
                db.run(`UPDATE Students SET 
                        StudentName = ?, 
                        StudentLastName = ?, 
                        StudentAge = ?, 
                        StudentClass = ?, 
                        StudentRegistrationDate = ? 
                        WHERE StudentID = ?`,
                    [final_Name, final_LastName, final_Age, final_Class, final_Date, Student_number_update],
                    function(err) {
                        if (err) return console.log(err.message);
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                        console.log(fixText("✅ تم تحديث البيانات بنجاح "));
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
                        
                        // 4. إغلاق الاتصال بأمان بعد انتهاء العملية الوحيدة
                        db.close(function(err) {
                            if (err) return console.error(err.message);
                            console.log('Close the database connection.');
                        });
                    }
                );

            } else {
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                let studentNotHere = "عذرا، هذا الطالب ليس هنا اعد تشغيل البرنامج";
                console.log(fixText(studentNotHere))
                console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                // إعادة المحاولة (تأكد من عدم وجود تداخل في الاتصالات هنا)
                // يفضل هنا عدم استدعاء update_student() مباشرة لتجنب التكرار اللانهائي، لكن لا بأس للمبتدئين
                // update_student() 
            }
        });
    });
}

function select_student() {
    console.log("-----------------------") 
    console.log("--- Select student ----")
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
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                        let studentNotHere = "عذرا، هذا الطالب ليس هنا اختر رقم اخر";
                        console.log(fixText(studentNotHere))
                        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
                        select_student()
                    }
                });
        });


}


function select_student_all(){
        console.log("----------------------------")    
        console.log("--- Select all students ----")   
     
        db.all(`SELECT * FROM Students`,(err,table) => {
            if (err) return console.log(err.message)
            console.log(table)
            db.close(function(err){
                if (err) return console.error(err.message);
                console.log('Close the database connection.')
            }); 
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

function display_lessons_before_action(callback) {
    console.log("List of registered students")
    db.all(`SELECT * FROM Lessons`, (err, rows) => {
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
