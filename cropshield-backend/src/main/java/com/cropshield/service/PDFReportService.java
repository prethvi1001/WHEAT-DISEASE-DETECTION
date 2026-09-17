package com.cropshield.service;

import com.cropshield.model.Prediction;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PDFReportService {

    public byte[] generatePredictionReport(Prediction prediction) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Header Banner
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 22);
                contentStream.setNonStrokingColor(46, 125, 50); // Dark Green (#2E7D32)
                contentStream.newLineAtOffset(50, 740);
                contentStream.showText("CROPSHIELD DIAGNOSTIC REPORT");
                contentStream.endText();

                // Subtitle
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 10);
                contentStream.setNonStrokingColor(100, 100, 100);
                contentStream.newLineAtOffset(50, 725);
                contentStream.showText("Protecting Every Wheat Crop with Artificial Intelligence");
                contentStream.endText();

                // Line separator
                contentStream.setLineWidth(1.5f);
                contentStream.setStrokingColor(212, 175, 55); // Wheat Gold (#D4AF37)
                contentStream.moveTo(50, 715);
                contentStream.lineTo(550, 715);
                contentStream.stroke();

                // Farmer Details
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.setNonStrokingColor(0, 0, 0);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText("Diagnosis Information:");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(60, 660);
                String farmerName = (prediction.getUser() != null) ? prediction.getUser().getName() : "Guest Farmer";
                contentStream.showText("Farmer Name: " + farmerName);
                contentStream.newLineAtOffset(0, -15);
                String farmerEmail = (prediction.getUser() != null) ? prediction.getUser().getEmail() : "N/A";
                contentStream.showText("Farmer Contact: " + farmerEmail);
                contentStream.newLineAtOffset(0, -15);
                String dateStr = (prediction.getCreatedAt() != null) 
                        ? prediction.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                        : java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                contentStream.showText("Date of Analysis: " + dateStr);
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Report ID: CS-2026-" + prediction.getId());
                contentStream.endText();

                // Model Results Box
                contentStream.setNonStrokingColor(240, 245, 240); // Soft green background
                contentStream.addRect(50, 500, 500, 85);
                contentStream.fill();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.setNonStrokingColor(46, 125, 50); // Green
                contentStream.newLineAtOffset(70, 555);
                contentStream.showText("Detection Result: " + prediction.getDisease().getName());
                
                contentStream.setFont(PDType1Font.HELVETICA, 11);
                contentStream.setNonStrokingColor(0, 0, 0);
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Confidence Score: " + prediction.getConfidence() + "%");
                
                contentStream.newLineAtOffset(0, -18);
                contentStream.showText("Scientific Name: " + prediction.getDisease().getScientificName());
                
                contentStream.newLineAtOffset(0, -18);
                contentStream.showText("Severity Level: " + prediction.getDisease().getSeverity());
                contentStream.endText();

                // Detailed Medical Info
                int yOffset = 460;
                
                // Symptoms
                yOffset = addParagraph(contentStream, "Symptoms:", prediction.getDisease().getSymptoms(), yOffset);
                
                // Causes
                yOffset = addParagraph(contentStream, "Causes & Background:", prediction.getDisease().getCauses(), yOffset);

                // Prevention
                yOffset = addParagraph(contentStream, "Preventative Actions:", prediction.getDisease().getPrevention(), yOffset);

                // Treatment & Fungicides
                yOffset = addParagraph(contentStream, "Treatment Recommendations:", 
                        prediction.getDisease().getTreatment() + " Recommended Fungicides: " + prediction.getDisease().getFungicide(), yOffset);

                // expected recovery
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 11);
                contentStream.setNonStrokingColor(46, 125, 50);
                contentStream.newLineAtOffset(50, yOffset - 10);
                contentStream.showText("Expected Recovery: ");
                contentStream.setFont(PDType1Font.HELVETICA, 11);
                contentStream.setNonStrokingColor(0, 0, 0);
                contentStream.newLineAtOffset(120, 0);
                contentStream.showText(prediction.getExpectedRecovery() != null ? prediction.getExpectedRecovery() : "14-21 days under correct management");
                contentStream.endText();

                // Footer
                contentStream.setLineWidth(0.8f);
                contentStream.setStrokingColor(200, 200, 200);
                contentStream.moveTo(50, 45);
                contentStream.lineTo(550, 45);
                contentStream.stroke();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 8);
                contentStream.setNonStrokingColor(120, 120, 120);
                contentStream.newLineAtOffset(50, 30);
                contentStream.showText("This report is generated by CropShield AI-powered diagnostic engine. Consult an agronomist for critical spray schedules.");
                contentStream.newLineAtOffset(420, 0);
                contentStream.showText("Page 1 of 1");
                contentStream.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    private int addParagraph(PDPageContentStream contentStream, String title, String text, int yStart) throws IOException {
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 11);
        contentStream.setNonStrokingColor(46, 125, 50);
        contentStream.newLineAtOffset(50, yStart);
        contentStream.showText(title);
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA, 9);
        contentStream.setNonStrokingColor(50, 50, 50);
        contentStream.newLineAtOffset(50, yStart - 15);

        // Simple text wrap (max 85 chars per line for standard page margins)
        int lineLimit = 85;
        int currentY = yStart - 15;
        
        if (text.length() <= lineLimit) {
            contentStream.showText(text);
            contentStream.endText();
            return currentY - 20;
        } else {
            String[] words = text.split(" ");
            StringBuilder line = new StringBuilder();
            for (String word : words) {
                if (line.length() + word.length() + 1 > lineLimit) {
                    contentStream.showText(line.toString());
                    contentStream.newLineAtOffset(0, -12);
                    currentY -= 12;
                    line = new StringBuilder();
                }
                if (line.length() > 0) {
                    line.append(" ");
                }
                line.append(word);
            }
            if (line.length() > 0) {
                contentStream.showText(line.toString());
            }
            contentStream.endText();
            return currentY - 25;
        }
    }
}
