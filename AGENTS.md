<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep saved items, generation mode and draft state in the shared workspace module; this provides one consistent persistence and error-handling boundary.
- Reopen saved content using validated item IDs in each tool's search parameters; this preserves original inputs and chat turns.
- Compose chat using installed AI Elements primitives; this keeps the composer and streaming messages compatible with the AI SDK.
- Keep offline demo generation separate from live AI requests and label its results; examples must not masquerade as model output.
