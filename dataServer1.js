import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import {appendFileSync, existsSync, unlink, readdir}  from "fs";
import mkdirp from "mkdirp";
import mongoose from "mongoose";
import multer from "multer";
import mv from "mv";
import path from "path";
import { fileURLToPath } from "url";
import File from "./model/File.js";
import User from "./model/User.js";
import authenToken from "./middleware/authenToken.js";
import writeLog from './my_modules/writeLog.js';
import osu from 'node-os-utils';
var cpu = osu.cpu;

dotenv.config();

main().catch((err) => writeLog("dataServer1","database","error","Connect Database",err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://admin:Huyhuyhuy1998@cluster0.edeoy.mongodb.net/test"
  );
}

export default async function getCpudataServer1(){
  return await cpu.usage().then(data => data);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

ffmpeg.setFfmpegPath("./ffmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("./ffmpeg/bin/ffprobe.exe");

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.post("/getListFile", authenToken, (req, res) => {
  console.log("Dataserver1 served!");
  try{
  writeLog("dataServer1",req.username,"notification","REQUEST","GET LIST FILE");
  // Check trong collection User xem loại user là gì
    User.findOne({ username: req.username }, function (err, user) {
      if (err) {
        writeLog("dataServer1",req.username,"error","Get ListFile",err);
        res.json({ status: 0, message: err });
      }
      else {
        // Là modifier thì đưa ra tất cả listFile
        if (user.account_type === "modifier") {
          File.find().then((listFile) => {
            writeLog("dataServer1",req.username,"success","Get ListFile","Lấy danh sách File thành công!");
            res.json({ status: 1, listFile: listFile });
          })
          .catch(err => {
            writeLog("dataServer1",req.username,"error","Get ListFile",err);
          });
        } else {
          // Là người dùng bình thường thì đưa ra listFile mà họ có thôi
          File.find({ username: req.username }, function (err, listFile) {
            if (err) {
              writeLog("dataServer1",req.username,"error","Get ListFile",err);
              res.json({ status: 0, message: err });
            }
            else {
              writeLog("dataServer1",req.username,"success","Get ListFile","Lấy danh sách File thành công!");
              res.json({ status: 1, listFile: listFile });
            }
          });
        }
      }
    });
  } catch (err) {
  writeLog("dataServer1","server","error","Unknown",err);
  }
});

app.post("/removeFile", authenToken, (req, res) => {
  try{
    writeLog("dataServer1",req.username,"notification","REQUEST","REMOVE FILE");
    File.findById(req.body.id, function (err, file) {
      // Kiểm tra xem nó có phải chủ file không
      if (req.username === file.username) {
        let linkUpload =
          "./upload/" + file.username + "/input/" + file.file_upload;
        let linkConverted =
          "./upload/" + file.username + "/output/" + file.file_converted;
        if (existsSync("./upload/" + file.username)) {
          // Xoá file upload
          unlink(linkUpload, function (e) {
            if (err) writeLog("dataServer1",req.username,"error","Remove File Input",err);
          });

          // Xoá file converted
          unlink(linkConverted, function (e) {
            if (err) writeLog("dataServer1",req.username,"error","Remove File Output",err);
          });

          // Xoá list segment
          let linkDirectory = "./upload/" + file.username + "/segment/";
          readdir(linkDirectory, (err, files) => {
            if (err) writeLog("dataServer1",req.username,"error","Remove List File Segment",err);

            for (const file of files) {
              unlink(path.join(linkDirectory, file), (err) => {
                if (err) writeLog("dataServer1",req.username,"error","Remove List File Segment",err);
              });
            }
          });
        }

        file.remove(function () {
          // Xoá data khỏi database
          writeLog("dataServer1",req.username,"success","Remove File From Database","Xoá File thành công!");
          res.json({ status: 1, message: "Xoá file thành công!" });
        });
      } else {
        // Nếu không phải chủ file thì xem xem nó có phải admin k
        User.find(
          { username: req.username, account_type: "modifier" },
          function (err, userData) {
            if (err || userData.length === 0) {
              writeLog("dataServer1",req.username,"error","Remove File","Hệ thống lỗi hoặc người dùng đang cố gắng xoá tệp không phải của họ!");
              res.json({
                status: 0,
                message: "Không được xoá file không phải của mình!",
              });
            } else {
              let linkUpload =
                "./upload/" + file.username + "/input/" + file.file_upload;
              let linkConverted =
                "./upload/" + file.username + "/output/" + file.file_converted;
              if (existsSync("./upload/" + file.username)) {
                // Xoá file upload
                unlink(linkUpload, function (e) {
                  if (e) writeLog("dataServer1",req.username,"error","Remove File Input",err);
                });

                // Xoá file converted
                unlink(linkConverted, function (e) {
                  if (e) writeLog("dataServer1",req.username,"error","Remove File Output",err);
                });

                // Xoá list segment
                let linkDirectory = "./upload/" + file.username + "/segment/";
                readdir(linkDirectory, (err, files) => {
                  if (err) writeLog("dataServer1",req.username,"error","Remove List File Segment",err);

                  for (const file of files) {
                    unlink(path.join(linkDirectory, file), (err) => {
                      if (err) writeLog("dataServer1",req.username,"error","Remove File File Segment",err);
                    });
                  }
                });
              }

              file.remove(function () {
                // Xoá data khỏi database
                writeLog("dataServer1",req.username,"success","Remove File From Database","Xoá File thành công!");
                res.json({ status: 1, message: "Xoá file thành công!" });
              });
            }
          }
        );
      }
    });
  } catch (err) {
    writeLog("dataServer1","server","error","Unknown",err);
  }
});

app.post("/uploadFile", authenToken, upload.single("video"), (req, res) => {
  try{
    writeLog("dataServer1",req.username,"notification","REQUEST","UPLOAD FILE");
    let username = req.username;
    let filename = req.file.filename;

    if (!existsSync("./upload/" + username)) mkdirp("./upload/" + username);
    if (!existsSync("./upload/" + username + "/input"))
      mkdirp("./upload/" + username + "/input");
    if (!existsSync("./upload/" + username + "/segment"))
      mkdirp("./upload/" + username + "/segment");
    if (!existsSync("./upload/" + username + "/output"))
      mkdirp("./upload/" + username + "/output");

    mv(
      "./upload/" + filename,
      "./upload/" + username + "/input/" + filename,
      (err) => {
        if (err) {
          writeLog("dataServer1",req.username,"error","Move File",err);
          res.json({ status: 0, message: "Move File Fail!" });
        }
      }
    );

    ffmpeg("./upload/" + username + "/input/" + filename)
      .outputOptions([
        "-f hls",
        "-max_muxing_queue_size 2048",
        "-hls_time 1",
        "-hls_list_size 0",
        "-hls_segment_filename",
        "./upload/" + username + "/segment/" + filename + "-%d.ts",
        "-hls_base_url",
        process.env.URL +
          ":" +
          process.env.PORT_NGINX +
          "/upload/" +
          username +
          "/segment/",
      ])
      .output("./upload/" + username + "/output/" + filename + ".m3u8")
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err, stdout, stderr) {
        console.log("An error occurred: " + err.message, err, stderr);
      })
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", function (err, stdout, stderr) {
        console.log("Finished processing!" /*, err, stdout, stderr*/);
        // Lưu dữ liệu vào server xong. Giờ lưu thông tin vào server
        let file = new File({
          username: username,
          file_upload: filename,
          file_converted: filename + ".m3u8",
        });
        file.save().then(() => {
          writeLog("dataServer1",req.username,"success","Upload File","Upload và convert file thành công!");
          appendFileSync("./upload/" + username + "/output/" + filename + ".m3u8", "\n#NOTIFICATION=WELCOME TO MY VIDEO");
          res.json({ status: 1, message: "Upload và convert file thành công!", outputVideo: process.env.URL + ":" + process.env.PORT_NGINX + "/upload/" + username + "/output/" + filename + ".m3u8"});
        });
      })
      .run();
  } catch (err) {
    writeLog("dataServer1","server","error","Unknown",err);
  }
});

app.get("/:id/tai-file-upload", function (req, res) {
  File.findById(req.params.id, function (err, file) {
    res.download(
      "./upload/" + file.username + "/input/" + file.file_upload,
      function (err) {
        if (err) console.log(err);
      }
    );
  });
});

app.get("/:id/tai-file-convert", function (req, res) {
  File.findById(req.params.id, function (err, file) {
    res.download(
      "./upload/" + file.username + "/output/" + file.file_converted,
      function (err) {
        if (err) console.log(err);
      }
    );
  });
});

app.listen(process.env.PORT_DATA_SERVER1 || 3002, () =>{
  writeLog("dataServer1","server","success","Start Server","dataServer1 listening on: " + process.env.PORT_DATA_SERVER1 || 3002);
});