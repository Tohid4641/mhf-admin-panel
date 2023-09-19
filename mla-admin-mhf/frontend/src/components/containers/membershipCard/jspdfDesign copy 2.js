import moment from "moment"
import Logo from '../../images/main/mhfTreeLogo.jpg'
let diff
let pageDiff
// let textTop = 199
// let textLeft = 89
// let line_y1 = 200
// let line_y2 = 200
// let names = []

const jspdfDesign = (doc,memberDetails,profileImage) =>{
    console.log(memberDetails)

    // --------------------- MHF Card Front Side Designing    -----------------
        // Header
        doc.setDrawColor(0);
        doc.setFillColor(37, 60, 128);
        doc.rect(20, 20, 160, 25, 'F'); // filled blue square

        // BodyImage
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 24, 17, 17, 'F'); // filled blue square
        doc.addImage(Logo, 'JPEG', 25, 24, 17, 17, 3, 3,"alias1", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(4.5)
        // doc.setDrawColor(255, 255, 255);
        doc.setDrawColor(37, 60, 128);
        doc.setFillColor(255, 255, 255)
        doc.circle(34, 32, 10.5, 'D')

        doc.setTextColor(255, 255, 255);
        doc.setFont('sans-serif')
        doc.setFontSize(20)
        doc.text(60, 30, 'Mujtaba Helping Foundation');
        doc.setFontSize(14)
        doc.text(44, 39, 'The Hands That Help Are Holler Than The Lips That Pray');

        // Body
        doc.setFillColor(255, 255, 255);
        doc.rect(20, 45, 160, 75, 'F'); // filled white square
        doc.setFontSize(13  )
        doc.setTextColor(108, 117, 125);
        doc.text(58, 60, 'Full Name');
        doc.text(58, 80, 'Father Name');
        doc.text(25, 90, 'Address');
        doc.setTextColor(0, 0, 0);
        doc.text(58, 70, memberDetails.fullName);
        doc.text(58, 90, memberDetails.fatherName)
        doc.text(25, 100, memberDetails.address);
        // BodyImage
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 55, 25, 25, 'F'); // filled blue square
        doc.addImage(profileImage, 'JPEG', 25, 55, 25, 25,"alias2", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(8)
        doc.setDrawColor(255, 255, 255);
        doc.setFillColor(255, 0, 0)
        doc.circle(38, 68, 15, 'D')
        // BodyText
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13)
        doc.text(114, 55, `Card ID: #MHF002 ${memberDetails.memberShipId}`);
        doc.text(22, 110, `Card Issue : ${moment(memberDetails.createdAt).format("YYYY-MM-DD")}`);
        doc.text(138, 110, `Expiry : ${moment(memberDetails.expiryDate).format("YYYY-MM-DD")}`);

        // Footer
        doc.setFillColor(37, 60, 128);
        doc.rect(20, 120, 160, 10, 'F'); // filled blue square
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14)
        doc.text(21, 126, 'www.mhfglobal.com');
        doc.setFontSize(14)
        doc.text(120, 126, 'mhf8886210001@gmail.com');

    // --------------------- MHF Card Front Side Designing End  -----------------

    pageDiff = memberDetails.familyMembers.length > 7 ? (memberDetails.familyMembers.length - 7) * 125 : 0
    if(pageDiff){
        doc.addPage()
    }

    // ---------------------  MHF Card Back Side Designing    -------------------

        // Header
        doc.setDrawColor(0);
        doc.setFillColor(37, 60, 128);
        doc.rect(20, 150 - pageDiff, 160, 25, 'F'); // filled blue square

        // BodyImage
        doc.setFillColor(0, 255, 0);
        doc.rect(25, 154 - pageDiff, 17, 17, 'F'); // filled blue square
        doc.addImage(Logo, 'JPEG', 25, 154 - pageDiff, 17, 17, "alias1", 'SLOW');
        doc.setLineWidth(0);
        doc.setDrawColor(0)
        doc.setFillColor(255, 255, 255)
        doc.setLineWidth(4.5)
        // doc.setDrawColor(255, 255, 255);
        doc.setDrawColor(37, 60, 128);
        doc.setFillColor(255, 255, 255)
        doc.circle(34, 162 - pageDiff, 10.5, 'D')

        doc.setTextColor(255, 255, 255);
        doc.setFont('sans-serif')
        doc.setFontSize(20)
        doc.text(60, 160 - pageDiff, 'Mujtaba Helping Foundation');
        doc.setFontSize(14)
        doc.text(44, 169 - pageDiff, 'The Hands That Help Are Holler Than The Lips That Pray');
    
        // Body
        doc.setFillColor(255, 255, 255);
        doc.rect(20, 175 - pageDiff, 160, 75, 'F'); // filled white square
        doc.setFontSize(18)
        doc.setTextColor(108, 117, 125);
        doc.text(72, 188 - pageDiff, `Family Members (${memberDetails.familyMembers.length})`);
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0);

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

        memberDetails.familyMembers.map((m,i)=>{
            doc.text(54, 199 - pageDiff + (i*9), m.relation);
            doc.text(80, 199 - pageDiff + (i*9), m.name);
            doc.text(120, 199 - pageDiff + (i*9), m.idproof);
            doc.setDrawColor(108, 117, 125)
            doc.setLineWidth(0.1)
            doc.line(150, 200 - pageDiff + (i*9), 50, 200  - pageDiff + (i*9));
        })

        diff = memberDetails.familyMembers.length > 3 ? (memberDetails.familyMembers.length - 3) * 10 : 0

        // Address
        doc.setTextColor(108, 117, 125);
        doc.text(25, diff + 223 - pageDiff , 'MHF Office Address:');
        doc.setTextColor(0, 0, 0);
        doc.text(25, diff + 231 - pageDiff, '6-3 1240/2019/4, 2nd floor, Near Masjid Al-Habeeb,');
        doc.text(25, diff + 238 - pageDiff, 'Ms Maqta, Opp, Raj Bhavan, Somajiguda Hyderabad');
        doc.text(25, diff + 245 - pageDiff, '+91 8331960001, +91 8309488732,+91 8328266670.');
        // BodyText
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11)
        doc.text(123, 182 - pageDiff, `Card ID: #MHF002 ${memberDetails.memberShipId}`);
    
        // Footer
        doc.setFillColor(37, 60, 128);
        doc.rect(20, diff + 250 - pageDiff, 160, 10, 'F'); // filled blue square
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14)
        doc.text(21, diff + 256 - pageDiff, 'www.mhfglobal.com');
        doc.setFontSize(14)
        doc.text(120, diff + 256 - pageDiff, 'mhf8886210001@gmail.com');

    // ---------------------  MHF Card Back Side Designing End  -------------------

    // View PDF
    window.open(doc.output('bloburl'), '_blank');

    // Save PDF
    // doc.save('MyTest.pdf');
}

export default jspdfDesign