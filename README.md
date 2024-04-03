# PROJECT2-SEC-1-PenNgiMark :corn:

> INT203 Client side Web Project II

## Table of Contents :mag_right:
1. [About app](#about-app)
2. [Main Feature](#main-feature)
3. [How to use](#คู่มือการใช้งานแอปพลิเคชั่นสําหรับผู้ใช้งาน)
4. [Member list](#member-list)

## About app :interrobang:
Order POS is a comprehensive food management system, handles everything from ordering to queue management. 
Built using Vue.js, Tailwind CSS, and DaisyUI, it offers a user-friendly website interface for seamless operations.<br>

## คู่มือการใช้งานแอปพลิเคชั่นสําหรับผู้ใช้งาน :page_with_curl:  [วีดีโอการใช้งาน](https://youtu.be/DrhMo9TSlt8) 
[![Videoคู่มือการใช้งานแอปพลิเคชั่น](https://github.com/Tako-C/Phakphum/blob/master/Photo/CoolCup%20Cafe'.gif)](https://youtu.be/DrhMo9TSlt8)

### Main Feature :pushpin:
| **PAGE** | **FEATURES** |
|:--------:|:-------------|
| OrderMenu<br> |<li>List เเสดงรายการเมนูทั้งหมด <li>เลือกเมนูและดูรายละเอียดของเมนู <li>เพิ่มจำนวนและเลือกระดับความหวาน <li>เพิ่มรายการเมนูลงในตะกร้า <li>ลบรายการเมนูที่ต้องการจากตะกร้า <li>สามารถเลือกได้ว่าจะ Dine or Take away <li>เลือกช่องทางการชำระเงิน  <li>ยกเลิกรายการทั้งหมดในตะกร้า <li>Popup แจ้งเตือนแสดงการยืนยันการสั่งซื้อ |
| ListOrder<br>  |<li>List แสดงรายการOrderทั้งหมด <li>แสดงข้อมูลของOrder เช่น OrderNumber เมนู จำนวน ระดับความหวาน <li>เลือกเมนูในเเต่ละ Order เพื่อยืนยันว่าเมนูพร้อมเสิร์ฟ <li>แสดงประวัติรายการ Order ที่เสิร์ฟไปแล้ว                    |
| Management<br>  |<li>List เเสดงรายการเมนูทั้งหมด <li>แสดงข้อมูลของเมนู <li>แสดงจำนวนเมนูทั้งหมดที่มี <li>แสดงจำนวน orderทั้งหมดที่ลูกค้าสั่ง <li>แสดงจำนวนเมนูทั้งหมดที่ขายแล้ว(แก้ว) <li>แก้ไข (เพิ่ม,ลบ,อัพเดท)เมนูที่ต้องการ <li>แสดงข้อมูล Promotion <li>แก้ไข (เพิ่ม,ลบ,อัพเดท)Promotionที่ต้องการ                |

 * OrderMenu Page :raising_hand:
 1. เพิ่มรายการเมนูที่ต้องการ : เลือกรายการเมนู เลือกระดับความหวาน
 2. ยืนยันเมนู: ตรวจสอบรายการเมนูที่เเสดง เมื่อต้องการให้กดปุ่ม OK เพื่อเมนูลง Cart
 3. รายการออเดอร์ : ดูรายการเมนูล่าสุด ดูข้อมูลออเดอร์ สามารถเพิ่มจำนวน เลือกช่องทางการชำระเงิน และสามารถเลือกได้ว่าจะ Dine or Take away หรือยกเลิกออเดอร์ที่ต้องการ
 4. ยืนยันออเดอร์ : ตรวจสอบรายระเอียดข้อมูลของออเดอร์ เมื่อต้องการให้กดปุ่ม OK ยืนยันการสั่ง

 * ListOrder Page :necktie:
 1. เเสดงรายการออเดอร์ทั้งหมด : แสดงรายการออเดอร์ทั้งหมด แสดงข้อมูลออเดอร์(เมนู , จำนวน ,ระดับความหวาน , OrderNumber)
 2. เลือกเมนูในแต่ระออรเดอร์ : เลือกเมนูที่พร้อม serve
 3. ยืนยันการ Serve : ยืนยันว่าออเดอร์พร้อมเสิร์ฟ (serve ตาม OrderNumber)
 4. เเสดงประวัติออเดอร์ทั้งหมดที่เคย serve :  แสดงข้อมูลรายการออเดอร์ทั้งหมด( เวลาที่ serve , orderNumber, เมนุ , จำนวน , ระดับความหวาน)

 * Management Page :necktie:
 1. เเสดงข้อมูล total : แสดงจำนวนเมนูทั้งหมด แสดงจำนวนออรเดอร์ทั้งหมดที่ลูกค้าสั่ง แสดงจำนวนเมนูทั้งหมดที่ขายไปแล้ว
 2. เเสดงข้อมูลเมนูและ promotion : แสดงเมนูทั้งหมด และแสดง Promotion ทั้งหมด
 3. แก้ไขเมนูและ category : เพิ่ม ลบ หรืออัพเดทข้อมูลของเมนู
 4. แก้ไข promotion : เพิ่ม ลบ หรืออัพเดทข้อมูลของ promotion

## Member List :bust_in_silhouette:
|    **ID**   |       **NAME**      | **PERCENTAGE** |       **RESPONSIBILITY**       |
|:-----------:|:-------------------:|:--------------:|:-----------------------------|
| 65130500014 | Chanachai Mainoy    |        25    | <li>Navigation bar <li>management & function <li>UI element <li>Refactor code|
| 65130500024 | Taspol Thuanchamnan |       24     | <li>Function filter category <li>sweetness Card <li> button element|
| 65130500043 | Pannawat Sripa      |       26     | <li>Cart  <li>Modal Confirm <li>Promotion & Discount function <li>SearchInput function <li>Event state handler function |
| 65130500058 | Phakphum Prajrern   |        25    | <li>Order list Card prototype <li>modal History serve Table <li>Draft fetch funtions  <li> Loading page |
