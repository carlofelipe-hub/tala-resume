import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/preview";

interface PdfModernProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Geist", lineHeight: 1.5, color: "#14110d", flexDirection: "row", gap: 24 },
  sidebar: { width: 140, backgroundColor: "#fdf8ee", padding: 16, borderRadius: 8 },
  sidebarName: { fontFamily: "Instrument Serif", fontSize: 20, lineHeight: 1.1, marginBottom: 12 },
  sidebarLabel: { fontFamily: "Geist Mono", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 6 },
  sidebarText: { fontSize: 9, lineHeight: 1.6, color: "#555" },
  main: { flex: 1, minWidth: 0 },
  title: { fontSize: 11, color: "#555", marginBottom: 16, fontStyle: "italic" },
  sectionLabel: { fontFamily: "Geist Mono", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 6 },
  role: { fontWeight: 700, fontSize: 11 },
  company: { fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 },
  bullet: { fontSize: 10, marginBottom: 2, paddingLeft: 10 },
});

export function PdfModern({ data }: PdfModernProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.name}</Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sidebarLabel}>Contact</Text>
            <View style={styles.sidebarText}>
              <Text>{data.email}</Text>
              <Text>{data.phone}</Text>
              <Text>{data.location}</Text>
              {data.linkedin && <Text>{data.linkedin}</Text>}
            </View>
          </View>

          {data.skills.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sidebarLabel}>Skills</Text>
              <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{data.skills.join(" · ")}</Text>
            </View>
          )}

          {data.education.length > 0 && (
            <View>
              <Text style={styles.sidebarLabel}>Education</Text>
              {data.education.map((ed, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ fontWeight: 700, fontSize: 9 }}>{ed.school}</Text>
                  <Text style={{ fontSize: 9, color: "#555" }}>{ed.degree}</Text>
                  <Text style={{ fontFamily: "Geist Mono", fontSize: 8, color: "#888" }}>{ed.dates}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main content */}
        <View style={styles.main}>
          <Text style={styles.title}>{data.title}</Text>

          {data.summary && (
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.sectionLabel}>Profile</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{data.summary}</Text>
            </View>
          )}

          {data.experience.length > 0 && (
            <View>
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
          )}
        </View>
      </Page>
    </Document>
  );
}
