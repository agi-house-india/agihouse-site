from playwright.sync_api import sync_playwright

def test_signal_page():
    console_messages = []
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console messages
        def handle_console(msg):
            console_messages.append(f"[{msg.type}] {msg.text}")
            if msg.type == 'error':
                console_errors.append(msg.text)

        page.on('console', handle_console)

        print("=" * 60)
        print("Testing CSP Fix on Production")
        print("=" * 60)

        # Navigate to the signal page
        print("\n1. Navigating to https://narrative-launch.onrender.com/signal")
        page.goto('https://narrative-launch.onrender.com/signal')
        page.wait_for_load_state('networkidle')

        # Take initial screenshot
        page.screenshot(path='/tmp/signal-production-1-initial.png', full_page=True)
        print("   Screenshot saved: /tmp/signal-production-1-initial.png")

        # Check for CSP errors in console
        print("\n2. Checking for CSP errors in console...")
        csp_errors = [e for e in console_errors if 'Content Security Policy' in e or 'CSP' in e]
        if csp_errors:
            print("   ❌ CSP ERRORS FOUND:")
            for err in csp_errors:
                print(f"      {err}")
        else:
            print("   ✅ No CSP errors detected")

        # Test Step 1 - Fill out the form (using visible form elements)
        print("\n3. Testing Step 1 - Filling out startup info...")

        # Look for the Company Name input
        company_input = page.locator('input[placeholder*="Acme"]').first
        if not company_input.is_visible():
            company_input = page.locator('#startupName').first
        if not company_input.is_visible():
            company_input = page.locator('input').first

        if company_input.is_visible():
            company_input.fill('TestStartup AI')
            print("   ✅ Filled company name")
        else:
            print("   ⚠️  Company name input not found")

        # Fill the "What does your company do" textarea
        description_input = page.locator('textarea').first
        if description_input.is_visible():
            description_input.fill('AI-powered testing automation platform that helps companies ship faster with confidence')
            print("   ✅ Filled company description")
        else:
            print("   ⚠️  Description textarea not found")

        # Take screenshot after filling
        page.screenshot(path='/tmp/signal-production-2-filled.png', full_page=True)
        print("   Screenshot saved: /tmp/signal-production-2-filled.png")

        # Click Continue/Next button
        print("\n4. Clicking 'Continue' button...")
        continue_btn = page.locator('button:has-text("Continue")').first
        if not continue_btn.is_visible():
            continue_btn = page.locator('#step1NextBtn').first
        if not continue_btn.is_visible():
            continue_btn = page.locator('button[type="submit"]').first

        if continue_btn.is_visible():
            continue_btn.click()
            page.wait_for_timeout(1000)  # Wait for transition
            print("   ✅ Clicked Continue button")

            # Take screenshot after clicking
            page.screenshot(path='/tmp/signal-production-3-after-continue.png', full_page=True)
            print("   Screenshot saved: /tmp/signal-production-3-after-continue.png")
        else:
            print("   ❌ Continue button not found")

        # Check for any new CSP errors after interactions
        print("\n5. Final console error check after interactions...")
        csp_errors_final = [e for e in console_errors if 'Content Security Policy' in e or 'CSP' in e]
        other_errors = [e for e in console_errors if 'Content Security Policy' not in e and 'CSP' not in e]

        if csp_errors_final:
            print("   ❌ CSP ERRORS:")
            for err in csp_errors_final:
                print(f"      {err}")
        else:
            print("   ✅ No CSP errors")

        if other_errors:
            print("   ⚠️  Other console errors:")
            for err in other_errors:
                print(f"      {err[:100]}...")

        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"CSP Errors: {len(csp_errors_final)}")
        print(f"Other Errors: {len(other_errors)}")
        if len(csp_errors_final) == 0:
            print("🎉 CSP FIX VERIFIED - No inline handler violations!")
        print("=" * 60)

        browser.close()

        return len(csp_errors_final) == 0

if __name__ == '__main__':
    success = test_signal_page()
    exit(0 if success else 1)
