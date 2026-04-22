import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/preview";

interface PdfMinimalProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Geist", lineHeight: 1.6, color: "#14110d", textAlign: "center" },
  name: { fontFamily: "Instrument Serif", fontSize: 28, lineHeight: 1.1, marginBottom: 8 },
  title: { fontSize: 11, color: "#555", marginBottom: 6 },
  contact: { fontSize: 9.5, color: "#888", marginBottom: 32 },
  sectionLabel: { letterSpacing: 3, fontSize: 9, color: "#888", marginBottom: 10, textTransform: "uppercase" },
  role: { fontWeight: 700, fontSize: 11 },
  companyDates: { fontSize: 10, color: "#555", fontStyle: "italic" },
  bullet: { fontSize: 10, marginBottom: 3, paddingLeft: 10, textAlign: "left" },
});

export function PdfMinimal({ data }: PdfMinimalProps) {
  const contact = [data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(" · ");

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Name */}
        <Text style={styles.name}>{data.name}</Text>

        {/* Title */}
        <Text style={styles.title}>{data.title}</Text>

        {/* Contact */}
        <Text style={styles.contact}>{contact}</Text>

        {/* Summary */}
        {data.summary && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <Text style={{ fontSize: 10.5, lineHeight: 1.6, maxWidth: 480, marginHorizontal: "auto" }}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={{ marginBottom: 32, textAlign: "left" }}>
            <Text style={{ ...styles.sectionLabel, textAlign: "center" }}>Experience</Text>
            {data.experience.map((job, i) => (
              <View key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 18 }}>
                <View style={{ textAlign: "center" }}>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={styles.companyDates}>{job.company} · {job.dates}</Text>
                </View>
                {job.bullets.map((b, j) => (
                  <Text key={j} style={{ ...styles.bullet, marginTop: j === 0 ? 8 : 0 }}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sectionLabel}>Education</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={{ marginBottom: i === data.education.length - 1 ? 0 : 6 }}>
                <Text style={{ fontWeight: 700, fontSize: 10 }}>{ed.school}</Text>
                <Text style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{ed.degree} · {ed.dates}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.7 }}>{data.skills.join(" · ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
