#!/usr/bin/env node

/**
 * Diagnostic script untuk troubleshoot preorder data tidak muncul
 * Usage: node scripts/diagnose-preorder.mjs
 */

import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function diagnosePreorderIssue() {
  console.log("🔧 PREORDER DATA DIAGNOSTIC TOOL\n");
  console.log("Checking if preorder data appears in admin panel...\n");

  const issues = [];
  const tips = [];

  try {
    // Check 1: API Endpoint
    console.log("1️⃣  Checking API Endpoint...");
    const apiResponse = await fetch(`${BASE_URL}/api/preorder`);

    if (!apiResponse.ok) {
      issues.push(`❌ API Error: Status ${apiResponse.status}`);
    } else {
      console.log("✅ API Endpoint is working");
    }

    const data = await apiResponse.json();

    // Check 2: Data in Response
    console.log("2️⃣  Checking Data in Response...");
    if (!data.data || data.data.length === 0) {
      issues.push("⚠️  No preorder data in database");
      tips.push("💡 Create a test preorder:");
      tips.push("   1. Go to /products");
      tips.push("   2. Click on a product");
      tips.push("   3. Fill the preorder form and submit");
    } else {
      console.log(`✅ Found ${data.data.length} preorder(s)`);
    }

    // Check 3: Product Relationship
    console.log("3️⃣  Checking Product Relationship...");
    if (data.data && data.data.length > 0) {
      const hasProduct = data.data.some((p) => p.product);
      if (hasProduct) {
        console.log("✅ Product relationship is working");
      } else {
        issues.push("⚠️  Product relationship missing");
        tips.push("💡 Check that products exist in database");
      }
    }

    // Check 4: Data Structure
    console.log("4️⃣  Checking Data Structure...");
    if (data.data && data.data.length > 0) {
      const sample = data.data[0];
      const requiredFields = [
        "id",
        "customer_name",
        "customer_phone",
        "status",
        "created_at",
      ];
      const missing = requiredFields.filter((field) => !(field in sample));

      if (missing.length === 0) {
        console.log("✅ Data structure is valid");
      } else {
        issues.push(`⚠️  Missing fields: ${missing.join(", ")}`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📋 DIAGNOSTIC SUMMARY\n");

    if (issues.length === 0) {
      console.log("✅ All checks passed!");
      console.log("   Preorder data should appear in admin panel");
      console.log("   Refresh page at: /admin/preorder");
    } else {
      console.log("⚠️  Issues Found:\n");
      issues.forEach((issue) => console.log("   " + issue));
    }

    if (tips.length > 0) {
      console.log("\n💡 Recommendations:\n");
      tips.forEach((tip) => console.log("   " + tip));
    }

    console.log("\n" + "=".repeat(50));
  } catch (error) {
    console.error("❌ Diagnostic Error:", error.message);
  }
}

// Run diagnostic
diagnosePreorderIssue();
