from playwright.sync_api import sync_playwright

def test_directories():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Members Directory
        print("=" * 60)
        print("MEMBERS DIRECTORY")
        print("=" * 60)
        page.goto('https://agihouse-india.onrender.com/members')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(3000)

        # Check for member cards
        member_cards = page.locator('[class*="card"], [class*="member"], [class*="profile"]').all()
        print(f"Found {len(member_cards)} potential member elements")

        # Get all text content
        content = page.content()

        # Check for filter buttons
        filters = ['All', 'Founder', 'Investor', 'Talent', 'Enterprise']
        print("\nFilter buttons:")
        for f in filters:
            if page.locator(f'text={f}').count() > 0:
                print(f"  ✅ {f}")
            else:
                print(f"  ❌ {f}")

        # Check for member names (look for common patterns)
        print("\nMember details visible:")
        checks = [
            ('Name patterns', any(x in content for x in ['Sharma', 'Mehta', 'Singh', 'Krishnan'])),
            ('Roles/Titles', any(x in content for x in ['CEO', 'Founder', 'Engineer', 'Partner', 'Investor'])),
            ('Companies', any(x in content for x in ['AI', 'Ventures', 'Labs', 'OpenAI', 'Google'])),
            ('Cities', any(x in content for x in ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'])),
        ]
        for name, found in checks:
            print(f"  {'✅' if found else '❌'} {name}")

        page.screenshot(path='/tmp/members-detail.png', full_page=True)

        # Test Startups Directory
        print("\n" + "=" * 60)
        print("STARTUPS DIRECTORY")
        print("=" * 60)
        page.goto('https://agihouse-india.onrender.com/startups')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(3000)

        content = page.content()

        # Check for startup cards
        startup_cards = page.locator('[class*="card"], [class*="startup"]').all()
        print(f"Found {len(startup_cards)} potential startup elements")

        # Check for startup details
        print("\nStartup details visible:")
        checks = [
            ('Startup names', any(x in content for x in ['AI', 'Tech', 'Labs', 'Startup'])),
            ('Stages', any(x in content for x in ['Seed', 'Pre-seed', 'Series', 'idea', 'growth'])),
            ('Sectors', any(x in content for x in ['AI', 'ML', 'Fintech', 'Health', 'SaaS'])),
            ('Funding info', any(x in content for x in ['Raising', '₹', 'Cr', 'funding', 'raised'])),
            ('Cities', any(x in content for x in ['Bangalore', 'Mumbai', 'Delhi'])),
        ]
        for name, found in checks:
            print(f"  {'✅' if found else '❌'} {name}")

        page.screenshot(path='/tmp/startups-detail.png', full_page=True)

        # Test Events Page
        print("\n" + "=" * 60)
        print("EVENTS PAGE")
        print("=" * 60)
        page.goto('https://agihouse-india.onrender.com/events')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(3000)

        content = page.content()

        print("\nEvents details visible:")
        checks = [
            ('Event titles', any(x in content for x in ['Meetup', 'Event', 'Summit', 'Workshop', 'AI Founders'])),
            ('Dates', any(x in content for x in ['2025', '2026', 'January', 'February', 'March'])),
            ('Cities', any(x in content for x in ['Bangalore', 'Mumbai', 'Delhi'])),
            ('Event cards', page.locator('[class*="card"], [class*="event"]').count() > 0),
        ]
        for name, found in checks:
            print(f"  {'✅' if found else '❌'} {name}")

        page.screenshot(path='/tmp/events-detail.png', full_page=True)

        # Test Blog Page
        print("\n" + "=" * 60)
        print("BLOG PAGE")
        print("=" * 60)
        page.goto('https://agihouse-india.onrender.com/blog')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(3000)

        content = page.content()

        print("\nBlog details visible:")
        checks = [
            ('Blog posts', any(x in content for x in ['Welcome', 'AGI House', 'Article', 'Post'])),
            ('Dates/Time', any(x in content for x in ['2025', '2026', 'min read', 'ago'])),
            ('Blog cards', page.locator('[class*="card"], [class*="post"], [class*="article"]').count() > 0),
        ]
        for name, found in checks:
            print(f"  {'✅' if found else '❌'} {name}")

        page.screenshot(path='/tmp/blog-detail.png', full_page=True)

        # Check Deals page
        print("\n" + "=" * 60)
        print("DEALS PAGE")
        print("=" * 60)
        page.goto('https://agihouse-india.onrender.com/deals')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(3000)

        content = page.content()
        page.screenshot(path='/tmp/deals-detail.png', full_page=True)

        print("\nDeals details visible:")
        checks = [
            ('Deal tracking', any(x in content for x in ['Deal', 'Investment', 'Funding', 'Track'])),
            ('Stats', any(x in content for x in ['₹', 'Cr', 'Total', 'Network'])),
        ]
        for name, found in checks:
            print(f"  {'✅' if found else '❌'} {name}")

        browser.close()

        print("\n" + "=" * 60)
        print("Screenshots saved to /tmp/*-detail.png")
        print("=" * 60)

if __name__ == "__main__":
    test_directories()
