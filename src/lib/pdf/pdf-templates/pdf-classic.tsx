import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/preview";

interface PdfClassicProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Geist", lineHeight: 1.5, color: "#14110d" },
  name: { fontSize: 22, fontWeight: 700, lineHeight: 1.2 },
  contactRow: { fontSize: 9.5, color: "#555", marginTop: 4 },
  hr: { borderTop: "1px solid #ccc", marginVertical: 18 },
  sectionLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 },
  role: { fontWeight: 700, fontSize: 11 },
  company: { fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 },
  bullet: { fontSize: 10, marginBottom: 2, paddingLeft: 10 },
});

export function PdfClassic({ data }: PdfClassicProps) {
  const contact = [data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(" · ");

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.contactRow}>{contact}</Text>
        </View>

        <View style={styles.hr} />

        {/* Summary */}
        {data.summary && (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.sectionLabel}>Summary</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{data.summary}</Text>
            </View>
            <View style={styles.hr} />
          </>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.sectionLabel}>Experience</Text>
              {data.experience.map((job, i) => (
                <View key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 14 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
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
            <View style={styles.hr} />
          </>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.sectionLabel}>Education</Text>
              {data.education.map((ed, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: i === data.education.length - 1 ? 0 : 6 }}>
                  <View>
                    <Text style={{ fontWeight: 700, fontSize: 11 }}>{ed.school}</Text>
                    <Text style={{ fontSize: 10, color: "#555" }}>{ed.degree}</Text>
                  </View>
                  <Text style={{ fontSize: 9, color: "#555" }}>{ed.dates}</Text>
                </View>
              ))}
            </View>
            <View style={styles.hr} />
          </>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{data.skills.join(", ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
