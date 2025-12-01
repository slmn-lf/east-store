#!/usr/bin/env node

/**
 * Test script untuk check preorder data di database
 * Usage: node scripts/test-preorder-data.mjs
 */

import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function testPreorderAPI() {
  console.log("🔍 Testing Preorder API...\n");

  try {
    // Test 1: Check API endpoint
    console.log("1️⃣  Checking /api/preorder endpoint...");
    const response = await fetch(`${BASE_URL}/api/preorder`);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      return;
    }

    const data = await response.json();

    console.log(`✅ API Response:`, {
      success: data.success,
      count: data.count,
      dataLength: data.data?.length || 0,
    });

    // Test 2: Show preorder data
    if (data.data && data.data.length > 0) {
      console.log("\n2️⃣  Preorder Data:");
      data.data.slice(0, 3).forEach((preorder, index) => {
        console.log(`  ${index + 1}. ID: ${preorder.id}`);
        console.log(`     Customer: ${preorder.customer_name}`);
        console.log(`     Phone: ${preorder.customer_phone}`);
        console.log(`     Product: ${preorder.product?.title || "N/A"}`);
        console.log(`     Status: ${preorder.status}`);
        console.log(`     Size: ${preorder.size}`);
        console.log(`     Quantity: ${preorder.quantity}`);
        console.log(
          `     Total Price: Rp${preorder.total_price?.toLocaleString("id-ID") || 0}`
        );
        console.log(
          `     Created: ${new Date(preorder.created_at).toLocaleString("id-ID")}`
        );
        console.log("");
      });
    } else {
      console.log("\n⚠️  No preorder data found in database");
      console.log("   Create a test preorder at /products first");
    }

    // Test 3: Show stats
    console.log("3️⃣  Statistics:");
    if (data.data && data.data.length > 0) {
      const stats = {
        total: data.data.length,
        pending: data.data.filter((p) => p.status === "pending").length,
        confirmed: data.data.filter((p) => p.status === "confirmed").length,
        cancelled: data.data.filter((p) => p.status === "cancelled").length,
        completed: data.data.filter((p) => p.status === "completed").length,
      };
      console.log(`   Total: ${stats.total}`);
      console.log(`   Pending: ${stats.pending}`);
      console.log(`   Confirmed: ${stats.confirmed}`);
      console.log(`   Completed: ${stats.completed}`);
      console.log(`   Cancelled: ${stats.cancelled}`);
    } else {
      console.log("   No data available");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run test
testPreorderAPI();
