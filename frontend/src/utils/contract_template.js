const contractTemplate = `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM

Độc lập – Tự do – Hạnh phúc

------***------

HỢP ĐỒNG THUÊ PHÒNG TRỌ

BÊN A : BÊN CHO THUÊ

Ông/bà: {{name_a}} Năm sinh: {{birth_year_a}}

CMND số: {{id_number_a}} Ngày cấp {{id_issue_date_a}} Nơi cấp {{id_issue_place_a}}

Hộ khẩu: {{permanent_address_a}}

Địa chỉ: {{address_a}}

Điện thoại: {{phone_a}}

BÊN B : BÊN THUÊ

Ông/bà: {{name_b}} Năm sinh: {{birth_year_b}}

CMND số: {{id_number_b}} Ngày cấp {{id_issue_date_b}} Nơi cấp {{id_issue_place_b}}

Hộ khẩu: {{permanent_address_b}}

Địa chỉ: {{address_b}}

Điện thoại: {{phone_b}}

Hai bên cùng thỏa thuận ký hợp đồng với những nội dung sau:

Điều 1:

1. Bên A đồng ý cho bên B thuê một phòng thuộc địa chỉ {{address}}

2. Thời hạn thuê nhà là {{duration}} tháng kể từ ngày {{start_date}}

Điều 2 :

1. Giá tiền thuê nhà là {{price}} đồng/tháng (Bằng chữ {{price_in_words}})

2. Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày {{payment_date}} Tây hàng tháng.

3. Tiền điện: Bên B thanh toán cho {{electricity_recipient}} vào ngày {{electricity_payment_date}} hàng tháng với giá {{electricity_price}}

4. Tiền nước: Bên B thanh toán cho {{water_recipient}} vào ngày {{water_payment_date}} hàng tháng với giá {{water_price}}

5. Khoản khác (nếu có) {{other_fees}}

6. Bên B đặt tiền thế chân trước {{deposit}} đồng (Bằng chữ: {{deposit_in_words}}) cho bên A. Tiền thế chân sẽ được trả lại đầy đủ cho bên thuê khi hết hợp đồng thuê phòng trọ và thanh toán đầy đủ tiền điện, nước, phí dịch vụ và các khoản khác liên quan.

7. Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế chân.

8. Bên A ngưng hợp đồng (lấy lại nhà) trước thời hạn thì bồi thường gấp đôi số tiền bên B đã thế chân.

Điều 3 : Quyền và nghĩa vụ của bên cho thuê (Bên A)

1. Quyền của Bên cho thuê:

2. a) Yêu cầu Bên thuê sử dụng nhà ở đúng mục đích và đúng nội quy sử dụng nhà trọ đính kèm hợp đồng thuê nhà trọ này; phối hợp với các đơn vị liên quan trong việc xử lý vi phạm quy định về quản lý sử dụng nhà trọ;

3. b) Yêu cầu Bên thuê trả tiền thuê nhà đầy đủ và đúng thời hạn ghi trong hợp đồng;

4. c) Yêu cầu Bên thuê có trách nhiệm trả tiền để sửa chữa phần hư hỏng, bồi thường thiệt hại do lỗi của Bên thuê gây ra;

5. d) Được quyền chấm dứt hợp đồng khi có một trong các trường hợp quy định tại Điều 6 của hợp đồng này;

đ) Thu hồi nhà ở trong các trường hợp chấm dứt hợp đồng thuê nhà ở theo quy định tại Điều 6 của hợp đồng này.

1. e) Các quyền khác theo thỏa thuận ………………………….........................................

2. Nghĩa vụ của Bên cho thuê

3. a) Giao nhà ở cho Bên thuê đúng thời gian quy định tại Điều 1 của hợp đồng này;

4. b) Xây dựng nội quy sử dụng nhà ở sinh viên và phổ biến quy định về sử dụng nhà ở sinh viên cho Bên thuê và các tổ chức, cá nhân liên quan biết;

5. c) Thực hiện quản lý vận hành, bảo trì nhà ở cho thuê theo quy định;

6. d) Thông báo cho Bên thuê những thay đổi về giá thuê ít nhất là 01 tháng trước khi áp dụng giá mới.

đ) Phối hợp với Ban tự quản nhà sinh viên tuyên truyền, đôn đốc sinh viên thuê nhà ở chấp hành nội quy quản lý sử dụng nhà ở sinh viên.

e) Các nghĩa vụ khác theo thỏa thuận.........................………………...............................

Điều 4:Quyền và nghĩa vụ của Bên thuê (Bên B)

1. Quyền của Bên thuê:

2. a) Nhận nhà ở theo đúng thỏa thuận nêu tại Khoản 1 Điều 3 của hợp đồng này;

3. b) Yêu cầu Bên cho thuê sửa chữa kịp thời những hư hỏng của nhà ở và cung cấp dịch vụ thiết yếu theo thỏa thuận;

4. c) Chấm dứt hợp đồng khi không còn nhu cầu thuê mua nhà ở;

5. d) Thành lập Ban tự quản nhà ở sinh viên;

đ) Các quyền khác theo thỏa thuận ……………………….............................................

1. Nghĩa vụ của Bên thuê:

2. a) Trả đủ tiền thuê nhà theo đúng thời hạn đã cam kết;

3. b) Sử dụng nhà đúng mục đích; giữ gìn nhà ở, có trách nhiệm sửa chữa những hư hỏng và bồi thường thiệt hại do lỗi của mình gây ra;

4. c) Không được tự ý sửa chữa, cải tạo nhà ở thuê; chấp hành đầy đủ những quy định về quản lý sử dụng nhà ở và các quyết định của cơ quan có thẩm quyền về quản lý nhà ở;

5. d) Không được chuyển nhượng hợp đồng thuê nhà hoặc cho người khác cùng sử dụng nhà ở dưới bất kỳ hình thức nào;

đ) Chấp hành các quy định về nghiêm cấm trong sử dụng nhà ở và giữ gìn vệ sinh môi trường và an ninh trật tự trong khu vực cư trú;

1. e) Giao lại nhà cho Bên cho thuê trong các trường hợp chấm dứt hợp đồng quy định tại Điều 5 của hợp đồng này hoặc trong trường hợp nhà ở thuê thuộc diện bị thu hồi.

2. g) Các nghĩa vụ khác theo thỏa thuận..................................…………….......................

Điều 5: Chấm dứt hợp đồng thuê nhà trọ

Việc chấm dứt hợp đồng thuê nhà ở sinh viên thực hiện trong các trường hợp sau:

1. Khi hai bên cùng nhất trí chấm dứt hợp đồng thuê nhà ở;

2. Khi Bên thuê không còn thuộc đối tượng được thuê nhà ở hoặc khi Bên thuê nhà mất (chết);

3. Khi Bên thuê không trả tiền thuê nhà liên tục trong ba tháng mà không có lý do chính đáng;

4. Khi Bên thuê tự ý sửa chữa, đục phá kết cấu, cải tạo hoặc cơi nới nhà ở thuê;

5. Khi Bên thuê tự ý chuyển quyền thuê cho người khác hoặc cho người khác cùng sử dụng nhà ở;

6. Khi Bên thuê vi phạm các Điều cấm theo quy định;

7. Khi nhà ở cho thuê bị hư hỏng nặng có nguy cơ sập đổ hoặc nằm trong khu vực đã có quyết định thu hồi đất, giải phóng mặt bằng hoặc có quyết định phá dỡ của cơ quan nhà nước có thẩm quyền;

8. Khi một trong các bên đơn phương chấm dứt hợp đồng theo thỏa thuận (nếu có) hoặc theo quy định pháp luật.

Điều 6: Cam kết thực hiện và giải quyết tranh chấp

1. Các bên cam kết thực hiện đầy đủ các nội dung đã ghi trong hợp đồng này.

2. Mọi tranh chấp liên quan hoặc phát sinh từ hợp đồng này sẽ được bàn bạc giải quyết trên tinh thần thương lượng, hoà giải giữa hai bên. Trường hợp không hòa giải được thì đưa ra Tòa án để giải quyết

Điều 7: Điều khoản thi hành

Hợp đồng này có hiệu lực kể từ ngày ký. Hợp đồng này có {{pages}} trang, được lập thành 02 bản có giá trị như nhau, mỗi Bên giữ 01 bản.

Hà Nội, {{current_date}}

Bên cho thuê (Bên A)      Bên thuê (Bên B)
(Ký, ghi rõ họ tên)       (Ký, ghi rõ họ tên)
   `;

   export default contractTemplate;