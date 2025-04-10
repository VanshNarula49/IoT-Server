import express from "express";
import uniqueid from "generate-unique-id";
const app = express();
app.listen(3001);
app.set("view engine", "ejs");
app.use(express.static("public"));
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import cookieParser from "cookie-parser";
app.use(cookieParser());
import formData from "form-data";
import Mailgun from "mailgun.js";
const API_KEY = "";
const DOMAIN = ";
const mailgun = new Mailgun(formData);
const emailclient = mailgun.client({ username: "api", key: API_KEY });
const adminPassword = "Robify678";
import { MongoClient } from "mongodb";
const url = "";
const client = new MongoClient(url);
const dbName = "Robify";

async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  return "";
}
main().then(console.log).catch(console.error);
const db = client.db(dbName);
const UserCollection = db.collection("RobifyUsers");
const securecookie = "";

function adminAuth(req, res, next) {
  if (req.cookies.Password == securecookie) {
    next();
  } else {
    res.send("UNAUTHORIZED ACCESS!");
  }
}
var scoreSort = { score: -1 };
var ledColour = "(0,0,0)";
app.get("/gameplay", adminAuth, async (req, res) => {
  let userdata = await UserCollection.find().toArray();
  res.render("leaderboard", { data: userdata });
});
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/leaderboardShowcase", adminAuth, async (req, res) => {
  let userdata = await UserCollection.find({ qualified: true })
    .sort(scoreSort)
    .toArray();
  res.render("leaderboardShow", { data: userdata });
});
// Example route to fetch leaderboard data
app.get("/leaderboardShowcaseapi", adminAuth, async (req, res) => {
  let userdata = await UserCollection.find({ qualified: true })
    .sort(scoreSort)
    .toArray();
  res.json(userdata); // Return JSON response for AJAX request
});


app.post("/userAction", adminAuth, async (req, res) => {
  if (req.body.disqualify == "true") {
    await UserCollection.updateOne(
      { rid: req.body.regid },
      { $set: { qualified: false } }
    );
    res.redirect("/gameplay");
  }
  if (req.body.requalify == "true") {
    await UserCollection.updateOne(
      { rid: req.body.regid },
      { $set: { qualified: true } }
    );
    res.redirect("/gameplay");
  }
  if (req.body.plus1 == "true") {
    await UserCollection.updateOne(
      { rid: req.body.regid },
      { $inc: { score: +1 } }
    );
    res.redirect("/gameplay");
  }
  if (req.body.minus1 == "true") {
    await UserCollection.updateOne(
      { rid: req.body.regid },
      { $inc: { score: -1 } }
    );
    res.redirect("/gameplay");
  }
});

app.post("/delete", adminAuth, async (req, res) => {
  await UserCollection.deleteOne({ rid: req.body.regid });
  res.redirect("/register");
});

app.get("/register", adminAuth, async (req, res) => {
  let userdata = await UserCollection.find().toArray();
  res.render("register1", { msg: "", alertColor: "", data: userdata });
});
app.post("/register", adminAuth, async (req, res) => {
  let userdata = await UserCollection.find().toArray();
  if (await UserCollection.findOne({ rid: req.body.rid })) {
    res.render("register1", {
      msg: "User Already Exist",
      alertColor: "color:red;",
      data: userdata,
    });
  } else {
    await UserCollection.insertOne({
      uid: uniqueid({ length: 8 }),
      name: req.body.name,
      rid: req.body.rid,
      email: req.body.email,
      score: 0,
      qualified: true,
      msgboxact: false,
      tempact: false,
      quiz1: false ,
      quiz2: false,
      quiz3:false,
      quiz4:false
    });
    let userdata = await UserCollection.find().toArray();

    res.render("register1", {
      msg: "User Registered Succesfully",
      alertColor: "color:green;",
      data: userdata,
    });
  }
});

app.post("/mail", adminAuth, async (req, res) => {
  res.redirect("/register");

  let customMessage = (email, name, pswd) => {
    return {
      from: "IOT Platform <iotify@robify.in>",
      to: email,
      subject: "Email for User ID",
      text: `Hello ${name}, your user id for IOT Platform is : ${pswd}`,
    };
  };
  let mailuser = await UserCollection.findOne({ rid: req.body.regid });

  await emailclient.messages
    .create(DOMAIN, customMessage(mailuser.email, mailuser.name, mailuser.uid))
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/mailall", adminAuth, async (req, res) => {
  res.redirect("/register");

  let customMessage = (email, name, pswd) => {
    return {
      from: "IOT Platform <iotify@robify.in>",
      to: email,
      subject: "Email for User ID",
      text: `Hello ${name}, your user id for IOT Platform is : ${pswd}`,
    };
  };
  let userdata = await UserCollection.find({ qualified: true })
    .sort(scoreSort)
    .toArray();

  for (let index = 0; index < userdata.length; index++) {
    const mailuser = userdata[index];
    await emailclient.messages
      .create(
        DOMAIN,
        customMessage(mailuser.email, mailuser.name, mailuser.uid)
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { msg: "" });
});

app.post("/login", (req, res) => {
  if (
    req.body.username == "" &&
    req.body.password == ""
  ) {
    res.cookie("Password", securecookie, { maxAge: 2592000 }).redirect("/link");
  } else {
    res.render("login", { msg: "Wrong Password" });
  }
});

app.get("/link", adminAuth, (req, res) => {
  res.render("link");
});
app.get("/logout", (req, res) => {
  res.clearCookie("Password").redirect("/");
});

app.get("/rgbcontrol", adminAuth, (req, res) => {
  res.render("led");
});

app.get("/rgbcontrol/:rgb", adminAuth, async (req, res) => {
  res.sendStatus(200);

  ledColour = await req.params.rgb.slice(3);
  // console.log(ledColour)
});

app.get("/activity1/:uid", async (req, res) => {
  let user = await UserCollection.findOne({ uid: req.params.uid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    let weatherType = [
      "rain",
      "mist",
      "hot",
      "sunny",
      "windy",
      "cold",
      "breeze",
      "storm",
    ];
    res.json({
      registrationId: user.rid,
      name: user.name,
      temp: Math.floor((Math.random() + 0.1) * 35) + "°C",
      Humidity: Math.floor(Math.random() * 100) + "%",
      WeatherCondition: weatherType[Math.floor(Math.random() * 7)],
    });
  }
});

app.get("/rgbactivity/", async (req, res) => {
  // res.send(ledColour)
  let arr = ledColour.slice(1, ledColour.length - 1).split(",");
  let modifyFnc = (string) => {
    let value = parseInt(string);
    if (value < 10 && value > 0) {
      return "00" + value;
    }
    if (value < 100 && value >= 10) {
      return "0" + value;
    }
    if (value == 0) return "000";
    else {
      return value;
    }
  };
  res.send(
    modifyFnc(arr[0]) + "," + modifyFnc(arr[1]) + "," + modifyFnc(arr[2])
  );
});

let msgdata = { };
app.get("/msgbox", adminAuth, (req, res) => {
  res.render("messagebox", {
    msg: msgdata.msg,
    name: msgdata.name,
    rid: msgdata.rid,
  });
});
app.get("/clrmsg", adminAuth, (req, res) => {
  msgdata = { name: "Robify", rid: "🤖🦾👽", msg: "I am a message box. Fill me " };
  res.redirect("/msgbox");
});

app.post("/msgactivity/:uid", async (req, res) => {
  try {
    let user = await UserCollection.findOne({ uid: req.params.uid });
    
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    if (user.qualified === false) {
      return res.send("DISQUALIFIED!");
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).send("Invalid Data");
    }

    if (!user.msgboxact) {
      await UserCollection.updateOne(
        { rid: user.rid },
        { $inc: { score: 3 }, $set: { msgboxact: true } }
      );
      msgdata.name = user.name;
      msgdata.rid = user.rid;
      msgdata.msg = message.length <= 250 ? message : message.slice(0, 250);
      return res.send("GoodJob");
    } else {
      // Allow the user to send the message even if they have already been scored
      msgdata.name = user.name;
      msgdata.rid = user.rid;
      msgdata.msg = message.length <= 250 ? message : message.slice(0, 250);
      return res.send("Message received but already scored");
    }
  } catch (error) {
    console.error("Error handling message activity:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/tempactivity/:uid", async (req, res) => {
  let user = await UserCollection.findOne({ uid: req.params.uid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    if (user.qualified == false) {
      res.send("DISQUALIFIED!");
    } else {
      if (
        req.body == {} ||
        req.body.temperature == undefined ||
        req.body.temperature == ""
      ) {
        res.send("Invalid Data");
      } else {
        try {
          req.body.temperature = parseFloat(req.body.temperature);
          if (req.body.temperature <= 50 && req.body.temperature >= 10) {
            if (user.tempact == false) {
              await UserCollection.updateOne(
                { rid: user.rid },
                { $inc: { score: +3 }, $set: { tempact: true } }
              );
              res.send("GoodJob");
            } else {
              res.send("Already Done");
            }
          } else {
            res.send("Bad Data");
          }
        } catch (error) {
          res.send("Invalid Data");
        }
      }
    }
  }
});

app.get("/quiz1", async (req, res) => {
  let req_userid = req.query.userid;
  let req_field = req.query.field.trim();
  let user = await UserCollection.findOne({ uid: req_userid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    if (user.qualified == false) {
      res.send("DISQUALIFIED!");
    } else {
      console.log(true || false || false || false);
      if (
        req_field == "a" ||
        req_field == "b" ||
        req_field == "c" ||
        req_field == "d"
      ) {
        if (user.quiz1 == false) {
          if (req_field == "a") {
            await UserCollection.updateOne(
              { rid: user.rid },
              { $inc: { score: +3 }, $set: { quiz1: true } }
            );
            res.send("Good Job");
          } else {
            res.send("Wrong Answer");
          }
        } else {
          res.send("Already Done");
        }
      } else {
        res.send("Invalid Data");
      }
    }
  }
});
app.get("/quiz2", async (req, res) => {
  let req_userid = req.query.userid;
  let req_field = req.query.field.trim();
  let user = await UserCollection.findOne({ uid: req_userid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    if (user.qualified == false) {
      res.send("DISQUALIFIED!");
    } else {
      console.log(true || false || false || false);
      if (
        req_field == "a" ||
        req_field == "b" ||
        req_field == "c" ||
        req_field == "d"
      ) {
        if (user.quiz2 == false) {
          if (req_field == "c") {
            await UserCollection.updateOne(
              { rid: user.rid },
              { $inc: { score: +3 }, $set: { quiz2: true } }
            );
            res.send("Good Job");
          } else {
            res.send("Wrong Answer");
          }
        } else {
          res.send("Already Done");
        }
      } else {
        res.send("Invalid Data");
      }
    }
  }
});
app.get("/quiz3", async (req, res) => {
  let req_userid = req.query.userid;
  let req_field = req.query.field.trim();
  let user = await UserCollection.findOne({ uid: req_userid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    if (user.qualified == false) {
      res.send("DISQUALIFIED!");
    } else {
      console.log(true || false || false || false);
      if (
        req_field == "a" ||
        req_field == "b" ||
        req_field == "c" ||
        req_field == "d"
      ) {
        if (user.quiz3 == false) {
          if (req_field == "d") {
            await UserCollection.updateOne(
              { rid: user.rid },
              { $inc: { score: +3 }, $set: { quiz3: true } }
            );
            res.send("Good Job");
          } else {
            res.send("Wrong Answer");
          }
        } else {
          res.send("Already Done");
        }
      } else {
        res.send("Invalid Data");
      }
    }
  }
});
app.get("/quiz4", async (req, res) => {
  let req_userid = req.query.userid;
  let req_field = req.query.field.trim();
  let user = await UserCollection.findOne({ uid: req_userid });
  if (user == null) {
    res.send("user does not exist");
  } else {
    if (user.qualified == false) {
      res.send("DISQUALIFIED!");
    } else {
      console.log(true || false || false || false);
      if (
        req_field == "a" ||
        req_field == "b" ||
        req_field == "c" ||
        req_field == "d"
      ) {
        if (user.quiz4 == false) {
          if (req_field == "b") {
            await UserCollection.updateOne(
              { rid: user.rid },
              { $inc: { score: +3 }, $set: { quiz4: true } }
            );
            res.send("Good Job");
          } else {
            res.send("Wrong Answer");
          }
        } else {
          res.send("Already Done");
        }
      } else {
        res.send("Invalid Data");
      }
    }
  }
});
// Store connected clients
const clients = [];

// SSE endpoint for attendance stream
app.get('/attendanceStream', adminAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add the client to the list
  clients.push(res);

  // Send a keep-alive comment every 5 seconds to keep the connection alive
  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 5000);

  // Remove the client when they disconnect
  req.on('close', () => {
    clearInterval(keepAliveInterval);
    clients.splice(clients.indexOf(res), 1);
  });
});

// Function to send data to all connected clients
function sendAttendanceUpdate(data) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
// Modify the /attendance endpoint to send updates
app.post('/attendance', async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    const user = await UserCollection.findOne({ uid: userId });

    if (!user) {
      return res.status(404).send('User does not exist');
    }

    const now = new Date();

    if (!user.lastAttendance) {
      // First time attendance
      await UserCollection.updateOne(
        { uid: userId },
        { $set: { lastAttendance: now }, $inc: { score: 3 } }
      );
      sendAttendanceUpdate({ userId, name: user.name, score: user.score + 3 });
      return res.status(200).send(`Attendance marked for user ${userId}. Score: ${user.score + 3}`);
    } else {
      // Update last attendance time
      await UserCollection.updateOne(
        { uid: userId },
        { $set: { lastAttendance: now } }
      );
      sendAttendanceUpdate({ userId, name: user.name, score: user.score });
      return res.status(200).send(`Attendance marked for user ${userId}. Score: ${user.score}`);
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// New route to fetch attendance data
app.get('/attendanceData', adminAuth, async (req, res) => {
  try {
    const users = await UserCollection.find({}, { projection: { _id: 0, uid: 1, name: 1, lastAttendance: 1 } }).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/attendanceshow',adminAuth,(req,res)=>{
	res.render('attendance');
});

app.get('/service',adminAuth,(req,res)=>{
  UserCollection.updateMany({},{$set: { quiz1: false ,quiz2: false,quiz3:false,quiz4:false}})

})
app.get('/tits',(req,res)=>{
	res.render('jain');
});
