import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {appendFileSync, existsSync, unlink, readdir, readFile}  from "fs";
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
import addCommand from './my_modules/addCommand.js';
import osu from 'node-os-utils';
import ffmpeg from "ffmpeg-cli";
import fs from "fs";
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
  console.log("Dataserver1 served!");
  try{
    writeLog("dataServer1",req.username,"notification","REQUEST","UPLOAD FILE");
    let username = req.username;
    let filename = req.file.filename;
    let outputFormat = req.body.videoFormat;
    let outputCodec = null;
    switch(req.body.videoCodec){
      case "h264" :
        outputCodec = 'libx264';
        break;
      
      case "vp9" :
        outputCodec = 'libvpx-vp9';
        break;

      case "h265" :
        outputCodec = 'libx265';
       break;

      default:
        outputCodec = 'libx264';
    }

    if (!existsSync("./upload/" + username)) mkdirp("./upload/" + username);
    if (!existsSync("./upload/" + username + "/input"))
      mkdirp("./upload/" + username + "/input");
    if (!existsSync("./upload/" + username + "/output"))
      mkdirp("./upload/" + username + "/output");

    mv(
      "./upload/" + filename,
      "./upload/" + username + "/input/" + filename,
      (err) => {
        if (err) {
          writeLog("dataServer1",req.username,"error","Move File",err);
          res.json({ status: 0, message: "Convert file thất bại!" });
        }
      }
    );

    // Move file xong, giờ transcode
    console.log("Start convert!");
    if(outputFormat === "hls") {
      let command = addCommand([
        `-y -i ./upload/${username}/input/${filename}`,
        `-map 0 -map 0 -map 0 -map 0`,
        `-c:a aac -c:v ${outputCodec}`,
        `-s:v:0 2560x1440 -b:v:0 4000k`,
        `-s:v:1 1920x1080 -b:v:1 2000k`,
        `-s:v:2 1280x720 -b:v:2 1000k`,
        `-s:v:3 640x360 -b:v:3 100k`,
        `-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3"`,
        `-master_pl_name ${filename}-master.m3u8`,
        `-f hls`,
        `-max_muxing_queue_size 4096`,
        `-hls_time 5`,
        `-hls_list_size 0`,
        `-hls_segment_filename ./upload/${username}/output/%v-${filename}-fileSequence%d.ts`,
        `-hls_base_url http://localhost:80/upload/${username}/output/`,
        `./upload/${username}/output/%v-${filename}.m3u8`
      ]);
      ffmpeg
      .run(command)
      .then(result => {
        fs.readFile(`./upload/${username}/output/${filename}-master.m3u8`, 'utf8', (err, data) => {
          if(err) {
            res.json({ status: 0, message: "Convert file thất bại!"});
            writeLog("dataServer1",req.username,"error","Edit File","Đọc file thất bại!\n" + err);
          }
          else {
            let data_array = data.split("\n");
            let fixed_data = data_array.map((one) => one.replace(/(.*\.m3u8)$/g, (match) => {
              return `http://localhost:80/upload/${username}/output/${match}`;
            }));
            fs.writeFile(`./upload/${username}/output/${filename}-master.m3u8`, fixed_data.join("\n"), err => {
              if(err) {
                writeLog("dataServer1",req.username,"error","Upload File","Convert file thất bại!\n" + err);
                res.json({ status: 0, message: "Convert file thất bại!"});
              } else {
                let file = new File({
                  username: username,
                  file_upload: filename,
                  file_converted: filename + "-master.m3u8",
                });
                file.save().then(() => {
                  writeLog("dataServer1",req.username,"success","Upload File","Upload và convert file thành công!");
                  res.json({ status: 1, message: "Convert file thành công!"});
                });
              }
            });
          }
        });
        console.log("Convert success!");
      })
      .catch(err => {
        writeLog("dataServer1",req.username,"error","Upload File","Convert file thất bại!\n" + err);
        res.json({ status: 0, message: "Convert file thất bại!"});
      });
    } else if(outputFormat === "dash") {
      let command = addCommand([`-y -i ./upload/${username}/input/${filename}`,
        `-map 0:v -map 0:v -map 0:v -map 0:v -map 0:a`,
        `-c:a aac -c:v ${outputCodec}`,
        `-s:v:0 2560x1440 -b:v:0 8000k`,
        `-s:v:1 1920x1080 -b:v:1 6000k`,
        `-s:v:2 1280x720 -b:v:2 3000k`,
        `-s:v:3 320x180 -b:v:3 80k`,
        `-profile:v:1 baseline -profile:v:2 baseline -profile:v:3 baseline -profile:v:0 main`,
        `-use_timeline 1`, 
        `-use_template 1`,
        `-adaptation_sets "id=0,streams=v id=1,streams=a"`,
        `-f dash`,
        `./upload/${username}/output/${filename}.mpd`
      ]);

      ffmpeg
      .run(command)
      .then(result => {
        console.log(outputCodec);
        console.log(result);
        let file = new File({
          username: username,
          file_upload: filename,
          file_converted: filename + ".mpd",
        });
        file.save().then(() => {
          writeLog("dataServer1",req.username,"success","Upload File","Upload và convert file thành công!");
          res.json({ status: 1, message: "Convert file thành công!"});
          console.log("Convert success!");
        });
      })
      .catch(err => {
        console.log(outputCodec);
        writeLog("dataServer1",req.username,"error","Upload File","Convert file thất bại!");
        res.json({ status: 0, message: "Convert file thất bại!"});
      });
    }
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