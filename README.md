# Angular21Tutorial



# @switch in Angular 21 – Complete Guide

Angular 21 supports the built-in `@switch` control flow syntax for displaying different sections of a template based on the value of an expression.

It is particularly useful when you have multiple possible values, such as:

- Order status: `pending`, `processing`, `shipped`, `delivered`
- User roles: `admin`, `user`, `guest`
- Payment status: `success`, `failed`, `pending`
- API response states: `loading`, `success`, `error`

Unlike the older `*ngSwitch` directive, `@switch` is built directly into Angular's template syntax. You don't need to import `CommonModule` just to use it.

## 1. What is @switch in Angular 21?

`@switch` allows you to conditionally render template content by comparing an expression against multiple possible values.

Basic syntax:

HTMLWrap linesCopy codePreview

```html
@switch (expression) {
  @case (value1) {
    <p>Content for value 1</p>
  }

  @case (value2) {
    <p>Content for value 2</p>
  }

  @default {
    <p>Default content</p>
  }
}
```

Angular evaluates the expression and renders the matching `@case` block.

If no case matches, Angular renders the `@default` block, if provided.

Important: Angular's `@switch` uses strict equality (`===`) when comparing values.

## 2. Difference between @if and @switch

Both are used for conditional rendering, but their purposes are different.

| Feature | @if | @switch |
| --- | --- | --- |
| Purpose | Check conditions | Match multiple values |
| Syntax | `@if (condition)` | `@switch (value)` |
| Comparison | Boolean conditions | Strict equality |
| Multiple branches | `@else if` | Multiple `@case` |
| Default branch | `@else` | `@default` |
| Best for | Complex conditions | Fixed set of values |

### Example using @if

typescript

```typescript
export class AppComponent {
  age = 25;
}
```

HTMLWrap linesCopy codePreview

```html
@if (age >= 18) {
  <p>You are an adult.</p>
} @else {
  <p>You are a minor.</p>
}
```

Here, Angular checks whether the condition is true or false.

### Example using @switch

typescript

```typescript
export class AppComponent {
  role = 'admin';
}
```

HTMLWrap linesCopy codePreview

```html
@switch (role) {
  @case ('admin') {
    <h2>Welcome Admin</h2>
  }

  @case ('user') {
    <h2>Welcome User</h2>
  }

  @case ('guest') {
    <h2>Welcome Guest</h2>
  }

  @default {
    <h2>Unknown Role</h2>
  }
}
```

Here, Angular compares `role` against multiple possible values.

When should you use them?

- Use `@if` when checking conditions such as age, permissions, or whether data exists.
- Use `@switch` when checking one variable against multiple known values.

## 3. Syntax of @switch, @case, and @default

There are three important keywords.

### @switch

Defines the expression that Angular should evaluate.

HTMLWrap linesCopy codePreview

```html
@switch (orderStatus) {
  ...
}
```

### @case

Defines a matching value.

HTMLWrap linesCopy codePreview

```html
@case ('pending') {
  <p>Your order is pending.</p>
}
```

### @default

Defines fallback content when no case matches.

HTMLWrap linesCopy codePreview

```html
@default {
  <p>Unknown order status.</p>
}
```

### Complete example

app.component.ts

typescript

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  orderStatus = 'shipped';
}
```

app.component.html

HTMLWrap linesCopy codePreview

```html
<h2>Order Information</h2>

@switch (orderStatus) {

  @case ('pending') {
    <p>Order is waiting for confirmation.</p>
  }

  @case ('processing') {
    <p>Order is being processed.</p>
  }

  @case ('shipped') {
    <p>Your order has been shipped!</p>
  }

  @case ('delivered') {
    <p>Your order has been delivered.</p>
  }

  @default {
    <p>Unknown order status.</p>
  }

}
```

Output:

Order Information

Shipped

Your order has been shipped\!

Only the matching case is rendered.

Important points:

- You don't need `break` statements.
- Angular doesn't support switch fallthrough.
- You can have multiple `@case` blocks.
- `@default` is optional.
- Comparisons use strict equality (`===`).
  Angular
  +1

## 4. Using @switch with Angular Signals

Angular Signals work naturally with `@switch`.

A signal is a reactive value. When its value changes, Angular updates the template wherever that signal is read.

Let's understand with an example.

app.component.ts

typescript

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  status = signal('loading');

  loadData() {
    this.status.set('success');
  }

  showError() {
    this.status.set('error');
  }

}
```

app.component.html

HTMLWrap linesCopy codePreview

```html
<h2>API Status</h2>

<button (click)="loadData()">
  Load Data
</button>

<button (click)="showError()">
  Show Error
</button>

@switch (status()) {

  @case ('loading') {
    <p>Loading data...</p>
  }

  @case ('success') {
    <p>Data loaded successfully!</p>
  }

  @case ('error') {
    <p>Something went wrong!</p>
  }

  @default {
    <p>Unknown status.</p>
  }

}
```

How does it work?

1. Initially, `status()` returns `loading`.
2. Angular displays the loading message.
3. Clicking Load Data calls `status.set('success')`.
4. Angular automatically updates the displayed content.
5. Clicking Show Error changes the status to `error`.

Try the Signals example

Current status

loading

Loading  Success  Error

Loading data...

Interactive illustration of the three possible UI states.

### Important Angular 21 Signals tip: @let with @switch

There is an important detail when using exhaustive type checking with Signals.

Angular's template type checker cannot perform exhaustive checking directly on a signal call such as `@switch (status())`.

Instead, assign the signal value to a template variable using `@let`.

HTMLWrap linesCopy codePreview

```html
@let currentStatus = status();

@switch (currentStatus) {

  @case ('loading') {
    <p>Loading...</p>
  }

  @case ('success') {
    <p>Success!</p>
  }

  @case ('error') {
    <p>Error occurred!</p>
  }

  @default never;
}
```

Here, `@default never;` tells Angular that every possible value should already be handled.

If you add another value to the TypeScript union without adding a corresponding case, Angular can report a template type-checking error.

Use a typed union for this pattern:

typescript

```typescript
status = signal<'loading' | 'success' | 'error'>('loading');
```

Note: `@default never;` is an exhaustiveness assertion, not a user-facing fallback message. Use an ordinary `@default { ... }` when you want to display fallback content.

Angular

+1

## 5. Real-world example: Order status handling

Consider an e-commerce application.

An order can have these statuses:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Instead of writing multiple `@if` conditions, use `@switch`.

app.component.ts

typescript

```typescript
import { Component, signal } from '@angular/core';

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  orderStatus = signal<OrderStatus>('pending');

  updateStatus(status: OrderStatus) {
    this.orderStatus.set(status);
  }
}
```

app.component.html

HTMLWrap linesCopy codePreview

```html
<h2>Order Tracking</h2>

@let status = orderStatus();

@switch (status) {

  @case ('pending') {
    <div class="pending">
      <h3>Order Pending</h3>
      <p>Waiting for order confirmation.</p>
    </div>
  }

  @case ('confirmed') {
    <div class="confirmed">
      <h3>Order Confirmed</h3>
      <p>Your order has been confirmed.</p>
    </div>
  }

  @case ('processing') {
    <div class="processing">
      <h3>Processing Order</h3>
      <p>We are preparing your order.</p>
    </div>
  }

  @case ('shipped') {
    <div class="shipped">
      <h3>Order Shipped</h3>
      <p>Your package is on the way.</p>
    </div>
  }

  @case ('delivered') {
    <div class="delivered">
      <h3>Order Delivered</h3>
      <p>Your package has been delivered.</p>
    </div>
  }

  @case ('cancelled') {
    <div class="cancelled">
      <h3>Order Cancelled</h3>
      <p>Your order has been cancelled.</p>
    </div>
  }

  @default {
    <p>Invalid order status.</p>
  }

}
```

This is useful for:

- E-commerce order tracking.
- Payment processing.
- Shipment tracking.
- Task management applications.
- Booking management systems.

The main advantage is that all status-related UI is maintained in one readable structure.

## 6. Dropdown (select) example with switch-case

Another practical example is displaying different content based on the user's dropdown selection.

Let's create a dropdown containing different user roles.

app.component.ts

typescript

```typescript
import { Component, signal } from '@angular/core';

type UserRole = 'admin' | 'manager' | 'employee' | 'guest';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  selectedRole = signal<UserRole>('guest');

  onRoleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedRole.set(value as UserRole);
  }
}
```

app.component.html

HTMLWrap linesCopy codePreview

```html
<h2>Select User Role</h2>

<select
  [value]="selectedRole()"
  (change)="onRoleChange($event)">

  <option value="admin">Admin</option>
  <option value="manager">Manager</option>
  <option value="employee">Employee</option>
  <option value="guest">Guest</option>

</select>

@switch (selectedRole()) {

  @case ('admin') {
    <h3>Admin Dashboard</h3>
    <p>You have full access.</p>
  }

  @case ('manager') {
    <h3>Manager Dashboard</h3>
    <p>You can manage employees.</p>
  }

  @case ('employee') {
    <h3>Employee Dashboard</h3>
    <p>You can view your tasks.</p>
  }

  @case ('guest') {
    <h3>Guest Dashboard</h3>
    <p>You have limited access.</p>
  }

  @default {
    <p>Unknown role selected.</p>
  }

}
```

Expected behavior:

Select User Role

 Guest ## Guest Dashboard

You have limited access.

Limited accessInteractive demonstration of dropdown-based conditional rendering.

In a real Angular application, the `@switch` block handles the dashboard rendering while the dropdown updates the signal.

Important security note: Hiding dashboard content using `@switch` is only a UI decision. Always enforce role-based authorization on the backend as well.

## 7. Common mistakes developers make

Here are some mistakes to avoid when working with `@switch` in Angular 21.

### Mistake 1: Using assignment instead of comparison

Incorrect:

HTMLWrap linesCopy codePreview

```html
@switch (status = 'success') {
  @case ('success') {
    <p>Success!</p>
  }
}
```

Correct:

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('success') {
    <p>Success!</p>
  }
}
```

The switch expression should contain the value you want to evaluate.

### Mistake 2: Forgetting strict equality

Angular uses `===` comparison.

typescript

```typescript
status = 1;
```

This will not match:

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('1') {
    <p>Matched</p>
  }
}
```

Because `1 !== '1'`.

Correct:

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case (1) {
    <p>Matched</p>
  }
}
```

### Mistake 3: Expecting fallthrough

In JavaScript, traditional switch statements can fall through when you omit `break`.

Angular `@switch` does not support fallthrough.

You can group multiple cases like this:

HTMLWrap linesCopy codePreview

```html
@switch (status) {

  @case ('pending')
  @case ('processing') {
    <p>Order is in progress.</p>
  }

  @case ('delivered') {
    <p>Order completed.</p>
  }

}
```

Both `pending` and `processing` display the same content.

### Mistake 4: Forgetting to call a signal

Incorrect:

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('success') {
    <p>Success</p>
  }
}
```

If `status` is a signal, use:

HTMLWrap linesCopy codePreview

```html
@switch (status()) {
  @case ('success') {
    <p>Success</p>
  }
}
```

### Mistake 5: Using unnecessary @if conditions

Avoid unnecessarily writing multiple conditions when you are checking one variable against multiple fixed values.

Instead of:

HTMLWrap linesCopy codePreview

```html
@if (role === 'admin') {
  <p>Admin</p>
} @else if (role === 'user') {
  <p>User</p>
} @else if (role === 'guest') {
  <p>Guest</p>
}
```

Prefer:

HTMLWrap linesCopy codePreview

```html
@switch (role) {
  @case ('admin') {
    <p>Admin</p>
  }

  @case ('user') {
    <p>User</p>
  }

  @case ('guest') {
    <p>Guest</p>
  }
}
```

### Mistake 6: Confusing @switch with the old \*ngSwitch

Old Angular syntax:

HTMLWrap linesCopy codePreview

```html
<div [ngSwitch]="status">

  <p *ngSwitchCase="'success'">
    Success
  </p>

  <p *ngSwitchDefault>
    Default
  </p>

</div>
```

Modern Angular 21 syntax:

HTMLWrap linesCopy codePreview

```html
@switch (status) {

  @case ('success') {
    <p>Success</p>
  }

  @default {
    <p>Default</p>
  }

}
```

The built-in syntax is preferred. Angular deprecated the old `NgSwitch` directive starting in Angular 20.

Angular

+1

## 8. Importance of the default case

The `@default` block is important because it provides fallback content when no case matches.

Imagine your application receives a status from an API.

Expected statuses:

- `pending`
- `processing`
- `completed`

But the backend sends:

typescript

```typescript
status = 'unknown';
```

Without `@default`, Angular renders nothing for that value.

With `@default`, you can display a meaningful message.

HTMLWrap linesCopy codePreview

```html
@switch (status) {

  @case ('pending') {
    <p>Payment is pending.</p>
  }

  @case ('processing') {
    <p>Payment is processing.</p>
  }

  @case ('completed') {
    <p>Payment completed successfully.</p>
  }

  @default {
    <p>Invalid payment status. Please contact support.</p>
  }

}
```

### Why is @default important?

1. Error handling: Handles unexpected values.
2. Better user experience: Prevents blank UI sections.
3. API compatibility: Handles new or unexpected backend values.
4. Maintainability: Makes fallback behavior explicit.
5. Debugging: Helps developers identify invalid states.

### @default versus @default never

These two syntaxes have different purposes:

| Syntax | Purpose |
| --- | --- |
| `@default { ... }` | Displays fallback UI |
| `@default never;` | Enforces exhaustive type checking |

For example:

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('pending') {
    <p>Pending</p>
  }

  @case ('completed') {
    <p>Completed</p>
  }

  @default {
    <p>Unknown status</p>
  }
}
```

Use this when you want to handle unexpected values at runtime.

Use `@default never;` with a properly typed union when you want Angular to detect missing cases during template type checking.

## 9. Quick revision: Angular 21 @switch

| Concept | Explanation |
| --- | --- |
| `@switch` | Evaluates an expression |
| `@case` | Matches a specific value |
| `@default` | Displays fallback content |
| Strict equality | Uses `===` |
| Fallthrough | Not supported |
| Multiple cases | Can share one block |
| Signals | Supported using `signal()` |
| Common use | Status and role handling |
| Exhaustiveness | Supported with `@default never;` |


## Final takeaway

The easiest way to remember the difference:

- @if: Use it when you want to check whether a condition is true or false.
- @switch: Use it when you want to compare one expression against multiple possible values.
- @case: Defines each matching condition.
- @default: Handles unmatched values.
- Angular Signals: Make `@switch` reactive when the signal value changes.

My recommendation: In Angular 21 applications, prefer `@switch` for API status handling, payment states, order tracking, and role-based UI rendering. Use Signals when those states need to change reactively.








# Angular 21 Control Flow – Interview Questions and Answers

Angular control flow is an important topic for Angular interviews, especially for developers working with Angular 17+ and Angular 21.

Angular introduced built-in control flow syntax to simplify template conditions, loops, and conditional rendering.

The three main control flow blocks are:

- `@if` – Conditional rendering.
- `@for` – Iterating over collections.
- `@switch` – Matching multiple values.

There are also useful related blocks such as `@empty`, `@else`, `@else if`, and `@default`.

Below are 40 commonly asked Angular control flow interview questions, from beginner to advanced level.

## Level 1: Basic interview questions

### 1. What is Angular control flow?

Angular control flow is a built-in template syntax used to conditionally render elements, iterate over collections, and handle multiple conditions.

Example:

HTMLWrap linesCopy codePreview

```html
@if (isLoggedIn) {
  <h2>Welcome User!</h2>
} @else {
  <h2>Please Login</h2>
}
```

### 2. Which Angular version introduced built-in control flow?

Angular 17 introduced built-in control flow syntax.

It includes:

- `@if`
- `@else`
- `@else if`
- `@for`
- `@empty`
- `@switch`
- `@case`
- `@default`

### 3. What are the advantages of built-in control flow?

- Cleaner template syntax.
- No need for structural directive imports such as `NgIf`, `NgFor`, and `NgSwitch`.
- Better template type checking.
- Improved performance opportunities.
- More readable templates.

### 4. What is the difference between @if and \*ngIf?

| @if | \*ngIf |
| --- | --- |
| Built-in control flow | Structural directive |
| Introduced in Angular 17 | Available in earlier Angular versions |
| No CommonModule required | Requires NgIf import or CommonModule |
| Uses block syntax | Uses directive syntax |
| Preferred modern syntax | Deprecated since Angular 20 |

Example:

HTMLWrap linesCopy codePreview

```html
@if (isLoggedIn) {
  <p>Welcome!</p>
}
```

Old syntax:

HTMLWrap linesCopy codePreview

```html
<p *ngIf="isLoggedIn">Welcome!</p>
```

### 5. What is @else if?

It allows multiple conditional branches.

HTMLWrap linesCopy codePreview

```html
@if (marks >= 90) {
  <p>Grade A</p>
} @else if (marks >= 75) {
  <p>Grade B</p>
} @else if (marks >= 50) {
  <p>Grade C</p>
} @else {
  <p>Fail</p>
}
```

### 6. Can we use @if without @else?

Yes. Both `@else` and `@else if` are optional.

HTMLWrap linesCopy codePreview

```html
@if (isLoading) {
  <p>Loading...</p>
}
```

### 7. What is @switch?

`@switch` is used to compare an expression against multiple possible values.

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('success') {
    <p>Success</p>
  }
  @case ('error') {
    <p>Error</p>
  }
  @default {
    <p>Unknown status</p>
  }
}
```

### 8. What is the difference between @if and @switch?

| @if | @switch |
| --- | --- |
| Evaluates conditions | Matches values |
| Supports logical expressions | Uses strict equality |
| Best for true/false conditions | Best for multiple fixed values |
| Uses @else | Uses @default |

### 9. Does @switch support break statements?

No. Angular's built-in `@switch` does not require `break` statements and does not support traditional JavaScript switch fallthrough.

### 10. Is @default mandatory in @switch?

No. It is optional.

However, using `@default` is recommended when unexpected values need to be handled.

## Level 2: Intermediate interview questions

### 11. What is @for in Angular?

`@for` is a built-in control flow block used to iterate over arrays and other iterable collections.

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

### 12. Why is track important in @for?

The `track` expression helps Angular identify items between collection updates.

It allows Angular to reuse existing DOM elements instead of unnecessarily recreating them.

HTMLWrap linesCopy codePreview

```html
@for (product of products; track product.id) {
  <p>{{ product.name }}</p>
}
```

Using a unique identifier such as `product.id` is generally recommended.

### 13. Is track mandatory in @for?

Yes. Unlike the older `*ngFor`, `@for` requires a `track` expression.

### 14. What is the difference between track item and track item.id?

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user.id) {
  {{ user.name }}
}
```

Tracks users using their unique IDs.

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user) {
  {{ user.name }}
}
```

Tracks using the item object identity.

Tracking by a unique ID is generally better when objects may be replaced with new object instances.

### 15. What is @empty in Angular?

`@empty` displays content when an iterable collection contains no items.

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
} @empty {
  <p>No users found.</p>
}
```

### 16. What are contextual variables in @for?

Angular provides built-in contextual variables:

| Variable | Meaning |
| --- | --- |
| `$index` | Current index |
| `$first` | First item |
| `$last` | Last item |
| `$even` | Even index |
| `$odd` | Odd index |
| `$count` | Total number of items |

Example:

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user.id) {
  <p>
    {{ $index }} - {{ user.name }}
  </p>
}
```

### 17. Can we use @for inside @if?

Yes. Angular supports nested control flow blocks.

HTMLWrap linesCopy codePreview

```html
@if (isLoggedIn) {
  @for (user of users; track user.id) {
    <p>{{ user.name }}</p>
  }
}
```

### 18. Can we use @if inside @for?

Yes.

HTMLWrap linesCopy codePreview

```html
@for (user of users; track user.id) {
  @if (user.isActive) {
    <p>{{ user.name }}</p>
  }
}
```

### 19. What is the difference between \*ngFor and @for?

| \*ngFor | @for |
| --- | --- |
| Structural directive | Built-in control flow |
| Uses `trackBy` for custom tracking | Uses `track` |
| Requires NgFor import or CommonModule | No directive import |
| Supports older Angular versions | Angular 17+ |
| Deprecated since Angular 20 | Preferred modern syntax |

### 20. Can we use @switch inside @for?

Yes.

Example:

HTMLWrap linesCopy codePreview

```html
@for (order of orders; track order.id) {
  <h3>{{ order.name }}</h3>

  @switch (order.status) {
    @case ('pending') {
      <p>Pending</p>
    }
    @case ('completed') {
      <p>Completed</p>
    }
    @default {
      <p>Unknown</p>
    }
  }
}
```

## Level 3: Advanced interview questions

### 21. Does Angular control flow require CommonModule?

No. Built-in control flow blocks do not require `CommonModule`.

However, other features such as `date` and `currency` pipes may require their respective imports.

### 22. Can we use Angular Signals with @if?

Yes. Signals work naturally with built-in control flow.

typescript

```typescript
import { signal } from '@angular/core';

isLoggedIn = signal(false);
```

HTMLWrap linesCopy codePreview

```html
@if (isLoggedIn()) {
  <p>Welcome!</p>
} @else {
  <p>Please login.</p>
}
```

When the signal changes, Angular updates the relevant template.

### 23. Can we use Signals with @for?

Yes.

typescript

```typescript
users = signal([
  { id: 1, name: 'John' },
  { id: 2, name: 'David' }
]);
```

HTMLWrap linesCopy codePreview

```html
@for (user of users(); track user.id) {
  <p>{{ user.name }}</p>
}
```

### 24. What is @default never in Angular?

`@default never;` is used for exhaustive type checking in `@switch`.

Example:

typescript

```typescript
type Status = 'pending' | 'success' | 'error';

status: Status = 'pending';
```

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('pending') {
    <p>Pending</p>
  }
  @case ('success') {
    <p>Success</p>
  }
  @case ('error') {
    <p>Error</p>
  }
  @default never;
}
```

If a new status is added to the TypeScript union without a matching case, Angular's template type checker can report an error.

### 25. What is the difference between @default and @default never?

- `@default { ... }` displays fallback UI.
- `@default never;` enables exhaustive checking.

### 26. Does @if create an embedded view?

Conceptually, Angular's control flow manages conditional template views. Unlike `*ngIf`, it doesn't require a structural directive with microsyntax.

### 27. What is the difference between @for and Array.forEach()?

| @for | forEach() |
| --- | --- |
| Angular template control flow | JavaScript array method |
| Renders DOM elements | Executes a callback |
| Supports DOM tracking | Doesn't manage DOM tracking |
| Works in templates | Works in TypeScript/JavaScript |

### 28. What happens when the @for collection is empty?

If the collection is empty, Angular renders the `@empty` block if provided. Otherwise, the loop renders no items.

### 29. Can we use multiple @case blocks for the same content?

Yes.

HTMLWrap linesCopy codePreview

```html
@switch (status) {
  @case ('pending')
  @case ('processing') {
    <p>Order is in progress.</p>
  }
  @case ('completed') {
    <p>Order completed.</p>
  }
}
```

### 30. What is @defer in Angular?

`@defer` is another built-in template block used for deferred loading.

It allows Angular to delay loading certain components, directives, and pipes until a specified trigger occurs.

Example:

HTMLWrap linesCopy codePreview

```html
@defer (on viewport) {
  <app-dashboard />
} @placeholder {
  <p>Dashboard will load here.</p>
}
```

It is useful for improving initial loading performance.

## Level 4: Scenario-based interview questions

These questions are especially useful for experienced Angular developers.

### 31. How would you handle API loading, success, and error states?

Use a Signal and `@switch`.

typescript

```typescript
status = signal<'loading' | 'success' | 'error'>('loading');
```

HTMLWrap linesCopy codePreview

```html
@switch (status()) {
  @case ('loading') {
    <p>Loading...</p>
  }
  @case ('success') {
    <p>Data loaded successfully.</p>
  }
  @case ('error') {
    <p>Something went wrong.</p>
  }
  @default {
    <p>Unknown status.</p>
  }
}
```

### 32. How do you display a message when an array is empty?

Use `@for` with `@empty`.

HTMLWrap linesCopy codePreview

```html
@for (product of products; track product.id) {
  <p>{{ product.name }}</p>
} @empty {
  <p>No products available.</p>
}
```

### 33. How would you implement role-based UI rendering?

Use `@switch` to display different UI sections based on the role.

HTMLWrap linesCopy codePreview

```html
@switch (role()) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('manager') {
    <app-manager-dashboard />
  }
  @case ('user') {
    <app-user-dashboard />
  }
  @default {
    <p>Access unavailable.</p>
  }
}
```

Remember that UI rendering is not a replacement for backend authorization.

### 34. What happens if you forget the track expression in @for?

Angular reports a template compilation error because `track` is required.

Correct:

HTMLWrap linesCopy codePreview

```html
@for (item of items; track item.id) {
  <p>{{ item.name }}</p>
}
```

### 35. How do you avoid unnecessary DOM updates in @for?

Use a stable unique identifier.

HTMLWrap linesCopy codePreview

```html
@for (employee of employees; track employee.id) {
  <p>{{ employee.name }}</p>
}
```

Avoid using `$index` when the collection can be reordered, inserted into, or deleted from, because it may associate existing DOM nodes with different logical items.

### 36. Can we use @switch with an enum?

Yes.

typescript

```typescript
enum PaymentStatus {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Failed = 'FAILED'
}

paymentStatus = PaymentStatus.Pending;
```

HTMLWrap linesCopy codePreview

```html
@switch (paymentStatus) {
  @case (PaymentStatus.Pending) {
    <p>Payment Pending</p>
  }
  @case (PaymentStatus.Success) {
    <p>Payment Successful</p>
  }
  @case (PaymentStatus.Failed) {
    <p>Payment Failed</p>
  }
}
```

Make sure `PaymentStatus` is accessible to the component template, for example by exposing it as a component property.

### 37. Can @if and @switch be used together?

Yes.

HTMLWrap linesCopy codePreview

```html
@if (isLoggedIn()) {
  @switch (role()) {
    @case ('admin') {
      <p>Admin Dashboard</p>
    }
    @case ('user') {
      <p>User Dashboard</p>
    }
    @default {
      <p>Unknown Role</p>
    }
  }
} @else {
  <p>Please login.</p>
}
```

### 38. What is the difference between @defer and @if?

| @if | @defer |
| --- | --- |
| Conditional rendering | Deferred loading |
| Evaluates a condition | Uses loading triggers |
| Controls whether content is rendered | Controls when eligible dependencies are loaded |
| Useful for UI states | Useful for performance optimization |

### 39. Is built-in control flow faster than structural directives?

Built-in control flow provides Angular with more direct knowledge of template structure and enables performance optimizations.

However, actual performance depends on the use case, DOM complexity, tracking strategy, and update patterns. Don't assume every `@if` or `@for` is automatically faster in every scenario.

### 40. Should we use built-in control flow or structural directives in Angular 21?

Prefer built-in control flow for new Angular applications.

Use:

- `@if` instead of `*ngIf`.
- `@for` instead of `*ngFor`.
- `@switch` instead of `*ngSwitch`.

The older structural directives are deprecated, although they remain available for existing applications.

## 11. Practical coding interview challenges

Try solving these without looking at the answers first.

Test your understanding

0/6 answers revealed

Question 1. Display a message when the user is logged in; otherwise display a login message.

 Reveal answer

Question 2. Display all employee names and show 'No employees found' when the array is empty.

 Reveal answer

Question 3. Display different messages for pending, success, and failed payment statuses.

 Reveal answer

Question 4. Display a different dashboard for admin, manager, and employee roles.

 Reveal answer

Question 5. Display the first, last, and even-indexed products differently.

 Reveal answer

Question 6. Load a large dashboard component only when it enters the viewport.

 Reveal answer

 Reset answers

## 12. Most important topics to prepare for interviews

If you are preparing for an Angular 21 interview, prioritize these topics:

| Priority | Topic |
| --- | --- |
| High | @if vs \*ngIf |
| High | @for and track |
| High | @switch and @case |
| High | Signals with control flow |
| High | @empty |
| Medium | @default never |
| Medium | Contextual variables |
| Medium | @defer |
| Medium | Nested control flow |

Interview tip: Don't just memorize the syntax. Be prepared to explain why you would choose `@if`, `@for`, or `@switch` in a real application, and demonstrate how Signals update the UI.

Official documentation: [Angular Control Flow Guide](<https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com>).