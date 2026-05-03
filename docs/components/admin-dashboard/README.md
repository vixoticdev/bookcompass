# Admin Dashboard Documentation

## Purpose

The admin dashboard makes BookCompass operationally tunable. It should help the product owner understand what users are choosing, where recommendations fail, and which recommendation paths produce completed reads.

## Planned Areas

- Book management
- Author management
- Outcome tagging
- Recommendation tuning
- Drop-off analysis
- Popular recommendation paths
- User behavior analytics
- Subscription and monetization controls in later phases

## MVP Admin Screens

```text
/admin
/admin/books
/admin/authors
/admin/recommendation-tuning
/admin/analytics/dropoffs
/admin/analytics/recommendation-paths
```

## Day 3 Status

- `/admin` shell route exists in the frontend.
- `/admin/books` shell route exists in the frontend.
- Catalog list filters now exist in the API for seed/admin exploration.
- Full admin CRUD, analytics, role gates, and tuning controls are not implemented yet.
