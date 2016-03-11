var seeder = require('mongoose-seed');

seeder.connect('mongodb://heroku_xltc5vkw:5r521po7fhmfr5vhnjbufbgdjv@ds011399.mlab.com:11399/heroku_xltc5vkw',function(){
  seeder.loadModels([
    '../app/models/user.js',
    '../app/models/section.js',
    '../app/models/student_number.js',
    '../app/models/current_year.js',
    '../app/models/or_number.js',
    '../app/models/student.js'    
  ]);
  // CAREFUL WHEN SEEDING, CLEAR STUDENT  or STUDENT NUMBER COLLECTION?????????????
  seeder.clearModels(['User','Section','StudentNumber', 'CurrentYear','OrNumber','Student'],function(){
    seeder.populateModels(data);
  });
});

data = [{
  'model':'User',
  'documents':[
              {
                username: "alwin",
                password: "deleon",
                name: "Alwin"
              }
  ]
},
{
  'model':'OrNumber',
  'documents':[
              {
                curNumber:0
              }
  ]
},
{
  'model':'StudentNumber',
  'documents':[
              {
                curNumber: 0,
              }
  ]
},
{
  'model':'CurrentYear',
  'documents':[
              {
                a: '2015',
                b: '2016'
              }
  ]
},
{
  'model':'Section',
  'documents':[
              {
                name: "A",
                level: "1",
                room: "Room1"
              },
              {
                name: "B",
                level: "1",
                room: "Room2"
              },
              {
                name: "A",
                level: "2",
                room: "Room3"
              },
              {
                name: "B",
                level: "2",
                room: "Room4"
              },
              {
                name: "A",
                level: "3",
                room: "Room5"
              },
              {
                name: "B",
                level: "3",
                room: "Room6"
              },
              {
                name: "A",
                level: "4",
                room: "Room7"
              },
              {
                name: "B",
                level: "4",
                room: "Room8"
              },
              {
                name: "A",
                level: "5",
                room: "Room9"
              },
              {
                name: "B",
                level: "5",
                room: "Room10"
              },
              {
                name: "A",
                level: "6",
                room: "Room11"
              },
              {
                name: "B",
                level: "6",
                room: "Room12"
              },
              {
                name: "A",
                level: "7",
                room: "Room13"
              },
              {
                name: "B",
                level: "7",
                room: "Room14"
              },
              {
                name: "A",
                level: "8",
                room: "Room15"
              },
              {
                name: "B",
                level: "8",
                room: "Room16"
              },
              {
                name: "A",
                level: "9",
                room: "Room17"
              },
              {
                name: "B",
                level: "9",
                room: "Room18"
              },
              {
                name: "A",
                level: "10",
                room: "Room19"
              },
              {
                name: "B",
                level: "10",
                room: "Room20"
              }
  ]
}]