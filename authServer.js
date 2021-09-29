import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "./model/User.js";
import authenToken from "./middleware/authenToken.js";
import writeLog from './my_modules/writeLog.js';

main().catch((err) => writeLog("authServer","database","error","Connect Database",err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://admin:Huyhuyhuy1998@cluster0.edeoy.mongodb.net/test"
  );
}

export default function getCpuAuthServer(){
  let value = 0;
  os.cpuUsage(function(v){
    value = v*100;
  });
  return value;
}

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
  try{
    writeLog("authServer","guest","notification","REQUEST","LOGIN");
    const dataLogin = req.body; // Thông tin mà người dùng submit lên
    User.findOne(
      { username: dataLogin.username, password: dataLogin.password },
      function (err, data) {
        if (err || !data) {
          writeLog("authServer","guest","error","Login",`Đăng nhập thất bại - ${JSON.stringify(dataLogin)}`);
          res.json({status:0, message:"Đăng nhập thất bại!"});
        }
        else {
          const access_token = jwt.sign(
            { username: data.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
          );
          const refresh_token = jwt.sign(
            { username: data.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "24h" }
          );

          // Lưu refresh_token vào database và gửi trả access_token và refresh_token cho client
          data.refresh_token = refresh_token;
          data.save().then(() => {
            writeLog("authServer",dataLogin.username,"success","Login","Đăng nhập thành công!");
            res.json({
              status: 1,
              username: dataLogin.username,
              access_token,
              refresh_token,
              account_type: data.account_type,
              message:"Đăng nhập thành công!"
            });
          });
        }
      }
    );
  } catch (err) {
    writeLog("authServer","server","error","Unknown",err);
  }
});

app.post("/refreshToken", authenToken, (req, res) => {
  try{
    writeLog("authServer",req.username,"notification","REQUEST","REFRESH TOKEN");
    const refreshToken = req.body.refresh_token;

    // Check xem thằng client có gửi refreshToken không?
    if (!refreshToken) {
      writeLog("authServer",req.username,"error","Refresh Token","Không nhận được RefreshToken!");
      res.json({ status:0, message: "Không nhận được RefreshToken!" });
    }
    else {
      User.findOne({ refresh_token: refreshToken, username: req.username }, function (err, user) {
        // Check xem có mã token này trong database không
        if (err || !user) {
          writeLog("authServer",req.username,"error","Refresh Token","Không tìm thấy Refresh Token trong Database!");
          res.json({ status:0, message: "Không tìm thấy Refresh Token trong Database!" });
        }
        else {
          // Decoded nó xem có đúng refresh_token_secret không
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, data) => {
              if (err) {
                writeLog("authServer",req.username,"error","Refresh Token","Sai Refresh Token Secret Key!");
                res.json({ status:0, message: "Sai Refresh Token Secret Key!" });
              }

              // Thay access_token mới và res về
              const access_token = jwt.sign(
                { username: data.username},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "60s" }
              );
              writeLog("authServer",req.username,"success","Refresh Token","Refresh Token thành công!");
              res.json({ status:1, access_token, message: "Refresh Token thành công!"});
            }
          );
        }
      });
    }
  } catch (err) {
    writeLog("authServer","server","error","Unknown",err);
  }
});

app.post("/logout", authenToken, (req, res) => {
  try{
    writeLog("authServer",req.username,"notification","REQUEST","LOGOUT");
    const refreshToken = req.body.refresh_token;
    // Check xem thằng client có gửi refreshToken không?
    if (!refreshToken) {
      writeLog("authServer",req.username,"error","Logout","Không nhận được RefreshToken!");
      res.json({status:0, message:"Không nhận được RefreshToken!"});
    }
    else {
      // Xoá token trong database
      User.findOne({ refresh_token: refreshToken, username: req.username }, function (err, user) {
        // Check xem có mã token này trong database không
        if (err || !user) {
          writeLog("authServer",req.username,"error","Logout","Không tìm thấy Refresh Token trong Database!");
          res.json({status:0, message:"Không tìm thấy Refresh Token trong Database!"});
        }
        else {
          user.refresh_token =
            "bhsahsasasasmsasququisqbsqisaiasmasuhqiusnqiusnqsyuqinsqssimakasas";
          user.save();
          writeLog("authServer",req.username,"success","Logout","Đăng xuất thành công!");
          res.json({status: 1, message:"Đăng xuất thành công!"});
        }
      });
    }
  } catch (err) {
  writeLog("authServer","server","error","Unknown",err);
  }
});

app.listen(process.env.PORT_AUTH_SERVER || 3001, () =>{
  writeLog("dataServer","server","success","Start Server","AuthServer listening on: " + process.env.PORT_AUTH_SERVER || 3001);
});