# Providing Services

- the `@Injectable({providedIn: 'root'})` is deprecated. If you are using that, replae it with:
- `@Service()` - this does the same thing, and keeps you from using constructor injection.
- Jeff (me) doesn't use either - I provide them at the app.config or providers.
