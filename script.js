const formBox = document.getElementById("form-box");
      const summaryView = document.getElementById("summary-view");

      const fields = [
        {
          label: "Full Name",
          key: "name",
          validate: (val) => val.length >= 3,
          error: "Minimum 3 characters required",
        },
        {
          label: "Phone Number",
          key: "phone",
          validate: (val) => /^\d{10}$/.test(val),
          error: "Enter a valid 10-digit phone",
        },
        {
          label: "Email Address",
          key: "email",
          validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          error: "Enter a valid email",
        },
        {
          label: "City",
          key: "city",
          validate: (val) => val.length >= 3,
          error: "Minimum 3 characters required",
        },
        {
          label: "Favorite Sport",
          key: "favsport",
          validate: (val) => val.trim() !== "",
          error: "This field cannot be empty",
        },
        {
          label: "Favorite Team",
          key: "favteam",
          validate: (val) => val.trim() !== "",
          error: "This field cannot be empty",
        },
        {
          label: "Favorite Sport Icon",
          key: "favsporticon",
          validate: (val) => val.trim() !== "",
          error: "This field cannot be empty",
        },
      ];

      let current = 0;
      let formData = {};

      function renderField(index) {
        formBox.innerHTML = "";
        const field = fields[index];

        const input = document.createElement("input");
        input.placeholder = field.label;
        input.id = "input-field";

        const error = document.createElement("div");
        error.className = "error-message";

        const btn = document.createElement("button");
        btn.textContent = "Next";

        btn.onclick = (e) => {
          e.preventDefault();
          const value = input.value.trim();
          if (!field.validate(value)) {
            input.classList.add("shake");
            error.textContent = field.error;
            input.value = "";
            setTimeout(() => input.classList.remove("shake"), 400);
          } else {
            formData[field.key] = value;
            current++;
            if (current < fields.length) {
              renderField(current);
            } else {
              showSummary();
            }
          }
        };

        formBox.appendChild(input);
        formBox.appendChild(error);
        formBox.appendChild(btn);
      }

      function showSummary(editMode = false, readonly = false) {
        formBox.classList.add("hidden");
        summaryView.classList.remove("hidden");
        summaryView.innerHTML = "";

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginBottom = "20px";

        for (let field of fields) {
          const tr = document.createElement("tr");

          const tdLabel = document.createElement("td");
          tdLabel.textContent = field.label;
          tdLabel.style.padding = "10px";
          tdLabel.style.fontSize = "14px";
          tdLabel.style.borderBottom = "1px solid #9C27B0";
          tdLabel.style.width = "40%";

          const tdValue = document.createElement("td");
          tdValue.style.padding = "10px";
          tdValue.style.fontSize = "14px";
          tdValue.style.borderBottom = "1px solid #9C27B0";

          if (editMode) {
            const input = document.createElement("input");
            input.value = formData[field.key];
            input.dataset.key = field.key;
            input.style.width = "100%";
            input.style.padding = "8px";
            input.style.borderRadius = "6px";
            input.style.border = "1px solid #ccc";
            tdValue.appendChild(input);
          } else {
            tdValue.textContent = formData[field.key];
          }

          tr.appendChild(tdLabel);
          tr.appendChild(tdValue);
          table.appendChild(tr);
        }

        summaryView.appendChild(table);

        // Show buttons only if not readonly
        if (!readonly) {
          const btn = document.createElement("button");
          btn.textContent = editMode ? "Save" : "Edit";
          btn.style.marginTop = "10px";
          btn.onclick = () => {
            if (editMode) {
              const inputs = summaryView.querySelectorAll("input");
              inputs.forEach((input) => {
                formData[input.dataset.key] = input.value;
              });
              showSummary(false);
            } else {
              showSummary(true);
            }
          };
          summaryView.appendChild(btn);

          const submitBtn = document.createElement("button");
          submitBtn.textContent = "Submit";
          submitBtn.style.marginTop = "10px";
          submitBtn.style.marginLeft = "10px";
          submitBtn.style.background = "#4CAF50";
          submitBtn.onclick = () => {
            summaryView.innerHTML = `
        <h2 style="text-align:center; color:#4CAF50; font-size:22px;">
          🎉 Your form has been submitted successfully!
        </h2>
        <p style="text-align:center; margin-top: 20px;">
          <a href="#" id="view-response-link" style="color: #7873f5; text-decoration: underline;">
            👉 View your response
          </a>
        </p>
      `;

            const viewLink = document.getElementById("view-response-link");
            viewLink.onclick = (e) => {
              e.preventDefault();
              showSummary(false, true); // view-only mode
            };
          };
          summaryView.appendChild(submitBtn);
        }
      }

      renderField(current);