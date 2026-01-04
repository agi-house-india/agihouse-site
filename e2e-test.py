from playwright.sync_api import sync_playwright
import sys

def test_agihouse():
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test 1: Homepage loads
        print("Test 1: Homepage loads...")
        page.goto('https://agihouse-india.onrender.com')
        page.wait_for_load_state('networkidle')

        if "AGI House" in page.title() or "AGI House" in page.content():
            print("  ✅ Homepage loads correctly")
            results.append(("Homepage", True))
        else:
            print("  ❌ Homepage failed to load")
            results.append(("Homepage", False))

        page.screenshot(path='/tmp/agihouse-home.png', full_page=True)

        # Test 2: Navigation links exist
        print("Test 2: Navigation links...")
        nav_links = ['Startups', 'Members', 'Events', 'Blog', 'Sign In']
        for link in nav_links:
            if page.locator(f'text={link}').count() > 0:
                print(f"  ✅ '{link}' link found")
            else:
                print(f"  ❌ '{link}' link missing")
        results.append(("Navigation", True))

        # Test 3: Sign-in page
        print("Test 3: Sign-in page...")
        page.goto('https://agihouse-india.onrender.com/auth/signin')
        page.wait_for_load_state('networkidle')

        if page.locator('text=Continue with Google').count() > 0:
            print("  ✅ Google sign-in button found")
            results.append(("Sign-in", True))
        else:
            print("  ❌ Google sign-in button missing")
            results.append(("Sign-in", False))

        page.screenshot(path='/tmp/agihouse-signin.png')

        # Test 4: Members page
        print("Test 4: Members page...")
        page.goto('https://agihouse-india.onrender.com/members', timeout=15000)
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(2000)  # Wait for React to render
        page.screenshot(path='/tmp/agihouse-members.png')

        if "Member" in page.content() or "Directory" in page.content():
            print("  ✅ Members page loads")
            results.append(("Members", True))
        else:
            print("  ❌ Members page failed")
            results.append(("Members", False))

        # Test 5: Startups page
        print("Test 5: Startups page...")
        page.goto('https://agihouse-india.onrender.com/startups', timeout=15000)
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/agihouse-startups.png')

        if "Startup" in page.content() or "Directory" in page.content():
            print("  ✅ Startups page loads")
            results.append(("Startups", True))
        else:
            print("  ❌ Startups page failed")
            results.append(("Startups", False))

        # Test 6: Events page
        print("Test 6: Events page...")
        page.goto('https://agihouse-india.onrender.com/events', timeout=15000)
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/agihouse-events.png')

        if "Event" in page.content():
            print("  ✅ Events page loads")
            results.append(("Events", True))
        else:
            print("  ❌ Events page failed")
            results.append(("Events", False))

        # Test 7: Blog page
        print("Test 7: Blog page...")
        page.goto('https://agihouse-india.onrender.com/blog', timeout=15000)
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/agihouse-blog.png')

        if "Blog" in page.content() or "Welcome" in page.content():
            print("  ✅ Blog page loads")
            results.append(("Blog", True))
        else:
            print("  ❌ Blog page failed")
            results.append(("Blog", False))

        browser.close()

    # Summary
    print("\n" + "="*50)
    print("E2E TEST SUMMARY")
    print("="*50)
    passed = sum(1 for _, r in results if r)
    total = len(results)
    print(f"Passed: {passed}/{total}")

    for name, result in results:
        status = "✅" if result else "❌"
        print(f"  {status} {name}")

    print(f"\nScreenshots saved to /tmp/agihouse-*.png")

    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(test_agihouse())
