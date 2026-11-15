import { describe, expect, it } from "vitest";
import { verifyCertificate } from "@/lib/school-data";

describe("certificate verification", () => {
  it("confirms a valid certificate and returns the student's details", () => {
    const result = verifyCertificate("BBC2026/1043");
    expect(result.status).toBe("valid");
    if (result.status === "valid") {
      expect(result.certificate.studentName).toBe("Karan Bose");
      expect(result.certificate.course).toBe("LMV");
    }
  });

  it("accepts lowercase input with surrounding spaces", () => {
    expect(verifyCertificate("  bbc2026/1043 ").status).toBe("valid");
  });

  it("reports an unknown number as not found", () => {
    expect(verifyCertificate("BBC2026/9999").status).toBe("not_found");
  });

  it("never reports a revoked certificate as valid", () => {
    expect(verifyCertificate("BBC2025/0877").status).toBe("revoked");
  });

  it("rejects numbers that are not in the BBCyyyy/nnnn format", () => {
    expect(verifyCertificate("12345").status).toBe("invalid_format");
  });
});
