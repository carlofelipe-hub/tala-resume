import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/preview";

interface PdfEditorialProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Geist", lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 14, borderBottom: "1px solid #14110d", marginBottom: 18 },
  name: { fontFamily: "Instrument Serif", fontSize: 28, lineHeight: 1 },
  title: { fontSize: 11, color: "#555", marginTop: 4 },
  contact: { textAlign: "right", fontSize: 9, color: "#555", lineHeight: 1.6 },
  sectionLabel: { fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 },
  role: { fontWeight: 700, fontSize: 11 },
  company: { fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 },
  bullet: { fontSize: 10, marginBottom: 2, paddingLeft: 10 },
});

export function PdfEditorial({ data }: PdfEditorialProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <View style={styles.contact}>
            <Text>{data.email}</Text>
            <Text>{data.phone}</Text>
            <Text>{data.location}</Text>
            {data.linkedin && <Text>{data.linkedin}</Text>}
          </View>
        </View>

        {data.summary && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <Text style={{ fontSize: 10.5, lineHeight: 1.6 }}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Experience</Text>
            {data.experience.map((job, i) => (
              <View key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={{ fontSize: 9, color: "#555" }}>{job.dates}</Text>
                </View>
                <Text style={styles.company}>{job.company}</Text>
                {job.bullets.map((b, j) => (
                  <Text key={j} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Education</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: i === data.education.length - 1 ? 0 : 6 }}>
                <View>
                  <Text style={{ fontWeight: 700, fontSize: 11 }}>{ed.school}</Text>
                  <Text style={{ fontSize: 10, color: "#555" }}>{ed.degree}</Text>
                </View>
                <Text style={{ fontSize: 9, color: "#555" }}>{ed.dates}</Text>
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={{ fontSize: 10 }}>{data.skills.join(" · ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
