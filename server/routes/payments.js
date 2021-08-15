const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authOwner");

router.post("/complete", async (req, res) => {
    try {
      const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
      
      // 액세스 토큰(access token) 발급 받기
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: "8950747585904734", // REST API 키
          imp_secret: "be4bb5c45a89845ec93a7d86d0fea3eaecad15b0cf7cf6172e814c62a0beb8b52ddc02414a1a4add" // REST API Secret
        }
      });
      const { access_token } = getToken.data.response; // 인증 토큰
      
      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: "get", // GET method
        headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
      });
      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      // DB에서 결제되어야 하는 금액 조회
      const order = await Orders.findById(paymentData.merchant_uid);
      const amountToBePaid = order.amount; // 결제 되어야 하는 금액
     
      // 결제 검증하기
      const { amount, status } = paymentData;
      if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
        await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
        
        switch (status) {
          case "ready": // 가상계좌 발급
            // DB에 가상계좌 발급 정보 저장
            const { vbank_num, vbank_date, vbank_name } = paymentData;
            await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
            // 가상계좌 발급 안내 문자메시지 발송
            SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
            res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
            break;
          case "paid": // 결제 완료
            res.send({ status: "success", message: "일반 결제 성공" });
            break;
        }
      } else { // 결제금액 불일치. 위/변조 된 결제
        throw { status: "forgery", message: "위조된 결제시도" };
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });

module.exports = router;
