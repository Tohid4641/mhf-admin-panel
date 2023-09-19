/*   __________________________________________________________________________
    |                                                                          |
    |      CREATE FUNCTION THAT DESIGN PDF TEMPLATE USING JSPDF MODULE CODE    |
    |--------------------------------------------------------------------------|
    |  * jsPDF : Is an open-source library for generating PDF documents        |
    |            using javascript.                                             |                  
    |                                                                          |
    |  * HOW FUCTION WORK : Our function  generate pdf dynamically,            |
    |                       It have two sections first is 'card frontside'     |
    |                       and second is 'card backside' this two sections    |
    |                       is display in one a4 size page but if the card     |
    |                       backside family members is more then the limit     |
    |                       then this backside section is move to next page.   |                                                      
    |__________________________________________________________________________|

*/

import moment from "moment";
import Logo from '../../images/main/mhfTreeLogo.jpg';
let marDiff;         // MARGIN DIFFERENCE OF EACH MEMBERS DETAILS
let movingDiff;    // BACKSIDE CARD MOVEING DIFF IF MEMBERS IS INCREASES

// 
const createPDF = (doc, memberDetails, profileImage) => {

    /*   _______________________________
        |                               |
        |   MHF CARD FRONTSIDE DESIGN   |
        |_______________________________|
    */

        /*___________________________  HEADER  ______________________________*/

        doc.setDrawColor(0);
        doc.setFillColor(37, 60, 128);
        doc.rect(20, 20, 160, 25, 'F');     // FILLED BLUE SQUARE
        // LOGO
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 24, 17, 17, 'F');      // FILLED GREEN SQUARE
        doc.addImage(Logo, 'JPEG', 25, 24, 17, 17, 3, 3,"alias1", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(4.5)
        // doc.setDrawColor(255, 255, 255);
        doc.setDrawColor(37, 60, 128);
        doc.setFillColor(255, 255, 255)
        doc.circle(34, 32, 10.5, 'D')
        //TEXT
        doc.setTextColor(255, 255, 255);
        doc.setFont('sans-serif')
        doc.setFontSize(20)
        doc.text(60, 30, 'Mujtaba Helping Foundation');
        doc.setFontSize(14)
        doc.text(44, 39, 'The Hands That Help Are Holler Than The Lips That Pray');

        /*_____________________________  BODY  __________________________________*/

        doc.setFillColor(255, 255, 255);
        doc.rect(20, 45, 160, 75, 'F');     // FILLED WHITE SQUARE
        // DETAILS
        doc.setFontSize(13  )
        doc.setTextColor(108, 117, 125);
        doc.text(58, 60, 'Full Name');
        doc.text(58, 80, 'Father Name');
        doc.text(25, 90, 'Address');
        doc.setTextColor(0, 0, 0);
        doc.text(58, 70, memberDetails.fullName);
        doc.text(58, 90, memberDetails.fatherName)
        doc.text(25, 100, memberDetails.address);
        // IMAGE
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 55, 25, 25, 'F');      // FILLED BLUE SQUARE
        doc.addImage(profileImage, 'JPEG', 25, 55, 25, 25,"alias2", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(8)
        doc.setDrawColor(255, 255, 255);
        doc.setFillColor(255, 0, 0)
        doc.circle(38, 68, 15, 'D')
        // TEXT
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13)
        doc.text(114, 55, `Card ID: #MHF002 ${memberDetails.memberShipId}`);
        doc.text(22, 110, `Card Issue : ${moment(memberDetails.createdAt).format("YYYY-MM-DD")}`);
        doc.text(138, 110, `Expiry : ${moment(memberDetails.expiryDate).format("YYYY-MM-DD")}`);

        /*_____________________________  FOOTER  __________________________________*/

        doc.setFillColor(37, 60, 128);
        doc.rect(20, 120, 160, 10, 'F');        // FILLED BLUE SQUARE
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14)
        doc.text(21, 126, 'www.mhfglobal.com');
        doc.setFontSize(14)
        doc.text(120, 126, 'mhf8886210001@gmail.com');

        /*_____________________________________________________________________________________*/

    

    // BACKSIDE CARD MOVEING DIFF IF MEMBERS IS INCREASES
    movingDiff = memberDetails.familyMembers.length > 7 ? (memberDetails.familyMembers.length - 7) * 125 : 0
    if(movingDiff){
        // IF MEMBERS OUT OF LIMIT (7) THEN MOVE TO NEXT PAGE THE WHOLE CARD BACKSIDE
        doc.addPage()
    }

    /*   _______________________________
        |                               |
        |   MHF CARD BACKSIDE DESIGN    |
        |_______________________________|
    */

        /*___________________________  HEADER  ______________________________*/

        doc.setDrawColor(0);
        doc.setFillColor(37, 60, 128);
        doc.rect(20, 150 - movingDiff, 160, 25, 'F');     // FILLED BLUE SQUARE
        // LOGO
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 154 - movingDiff, 17, 17, 'F');      // FILLED BLUE SQUARE
        doc.addImage(Logo, 'JPEG', 25, 154 - movingDiff, 17, 17, "alias1", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(4.5)
        // doc.setDrawColor(255, 255, 255);
        doc.setDrawColor(37, 60, 128);
        doc.setFillColor(255, 255, 255)
        doc.circle(34, 162 - movingDiff, 10.5, 'D')
        // TEXT
        doc.setTextColor(255, 255, 255);
        doc.setFont('sans-serif')
        doc.setFontSize(20)
        doc.text(60, 160 - movingDiff, 'Mujtaba Helping Foundation');
        doc.setFontSize(14)
        doc.text(44, 169 - movingDiff, 'The Hands That Help Are Holler Than The Lips That Pray');
    
        /*___________________________  BODY  ______________________________*/

        doc.setFillColor(255, 255, 255);
        doc.rect(20, 175 - movingDiff, 160, 75, 'F');     // FILLED WHITE SQUARE
        //FAMILY MEMBERS TEXT
        doc.setFontSize(18)
        doc.setTextColor(108, 117, 125);
        doc.text(72, 188 - movingDiff, `Family Members (${memberDetails.familyMembers.length})`);
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0);

        
        /*  
            SHOWS ONLY 3 AND LESS THAN 3 FAMILY MEMBERS SECTION. 
            IF MORE THEN 3 THEN DISPLAY IN 3RD SECTION BY COMMA SEPERATED VALUE
        */
        
        // memberDetails.familyMembers.map((m,i,arr)=>{
        //     if(i<2){
        //         doc.text(textLeft - (3 * i), textTop + (8 * i), m.relation)
        //         doc.setDrawColor(108, 117, 125)
        //         doc.setLineWidth(0.1)
        //         doc.line(150, line_y1 + (8 * i), 50, line_y2 + (8 * i))
        //     }
        //     if(i>=2){
        //         names = [...names,m.relation]
        //     }
        //     if(i === arr.length - 1 && arr.length >= 3){
        //         let allNames = names.join(", ")

        //         doc.text(textLeft - (3 * i), textTop + (8 * 2),allNames)
        //         doc.setDrawColor(108, 117, 125)
        //         doc.setLineWidth(0.1)
        //         doc.line(150, line_y1 + (8 * 2), 50, line_y2 + (8 * 2))
        //         allNames = ''
        //         names=[]

        //     }
        // })

        // FAMILY MEMBERS DETAILS
        memberDetails.familyMembers.map((m,i)=>{
            doc.text(54, 199 - movingDiff + (i*9), m.relation);
            doc.text(80, 199 - movingDiff + (i*9), m.name);
            doc.text(120, 199 - movingDiff + (i*9), m.idproof);
            doc.setDrawColor(108, 117, 125)
            doc.setLineWidth(0.1)
            doc.line(150, 200 - movingDiff + (i*9), 50, 200  - movingDiff + (i*9));
        })

        // MARGIN DIFFERENCE OF EACH MEMBERS DETAILS
        marDiff = memberDetails.familyMembers.length > 3 ? (memberDetails.familyMembers.length - 3) * 10 : 0

        // OFFICE ADDRESS
        doc.setTextColor(108, 117, 125);
        doc.text(25, marDiff + 223 - movingDiff , 'MHF Office Address:');
        doc.setTextColor(0, 0, 0);
        doc.text(25, marDiff + 231 - movingDiff, '6-3 1240/2019/4, 2nd floor, Near Masjid Al-Habeeb,');
        doc.text(25, marDiff + 238 - movingDiff, 'Ms Maqta, Opp, Raj Bhavan, Somajiguda Hyderabad');
        doc.text(25, marDiff + 245 - movingDiff, '+91 8331960001, +91 8309488732,+91 8328266670.');
        // ID TEXT
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11)
        doc.text(123, 182 - movingDiff, `Card ID: #MHF002 ${memberDetails.memberShipId}`);
        
        /*___________________________  FOOTER  ______________________________*/

        doc.setFillColor(37, 60, 128);
        doc.rect(20, marDiff + 250 - movingDiff, 160, 10, 'F'); // filled blue square
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14)
        doc.text(21, marDiff + 256 - movingDiff, 'www.mhfglobal.com');
        doc.setFontSize(14)
        doc.text(120, marDiff + 256 - movingDiff, 'mhf8886210001@gmail.com');

        /*_______________________________________________________________________*/

    /*   _______________________________
        |                               |
        |     VIEW OR DOWNLOAD PDF      |
        |_______________________________|
    */

    // VIEW PDF
    window.open(doc.output('bloburl'), '_blank');

    // DOWNLOAD PDF
    // doc.save('MyTest.pdf');
}

export default createPDF