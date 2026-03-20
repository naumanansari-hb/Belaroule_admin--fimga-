// This file contains the filter section to be added after SummaryWidgets

{/* ========== SUMMARY WIDGETS ========== */}
<SummaryWidgets widgets={getSummaryWidgets()} />

{/* ========== FILTERS SECTION ========== */}
{showFilters && (
  <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
    <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
      <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
        Filters
      </h2>
    </div>
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <FormLabel htmlFor="category">Category</FormLabel>
          <FormSelect
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
            <option value="Outerwear">Outerwear</option>
          </FormSelect>
        </div>

        {/* Age Group Filter */}
        <div>
          <FormLabel htmlFor="ageGroup">Age Group</FormLabel>
          <FormSelect
            id="ageGroup"
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
          >
            <option value="all">All Age Groups</option>
            <option value="Infants">Infants</option>
            <option value="Toddlers">Toddlers</option>
            <option value="Children">Children</option>
            <option value="Teens">Teens</option>
            <option value="Young Adults">Young Adults</option>
            <option value="Adults">Adults</option>
          </FormSelect>
        </div>

        {/* Body Shape Filter */}
        <div>
          <FormLabel htmlFor="bodyShape">Body Shape</FormLabel>
          <FormSelect
            id="bodyShape"
            value={selectedBodyShape}
            onChange={(e) => setSelectedBodyShape(e.target.value)}
          >
            <option value="all">All Body Shapes</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Pear">Pear</option>
            <option value="Apple">Apple</option>
            <option value="Hour Glass">Hour Glass</option>
            <option value="Triangle">Triangle</option>
          </FormSelect>
        </div>

        {/* AI Status Filter */}
        <div>
          <FormLabel htmlFor="aiStatus">AI Status</FormLabel>
          <FormSelect
            id="aiStatus"
            value={selectedAIStatus}
            onChange={(e) => setSelectedAIStatus(e.target.value)}
          >
            <option value="all">All AI Status</option>
            <option value="processed">Processed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </FormSelect>
        </div>

        {/* Approval Status Filter */}
        <div>
          <FormLabel htmlFor="approvalStatus">Approval Status</FormLabel>
          <FormSelect
            id="approvalStatus"
            value={selectedApprovalStatus}
            onChange={(e) => setSelectedApprovalStatus(e.target.value)}
          >
            <option value="all">All Approval Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </FormSelect>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Filter by Created Date:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => {
              // Apply all filters logic will be added
              toast.success('Filters applied');
            }}
            className="px-3 py-1.5 text-xs bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedAgeGroup('all');
              setSelectedBodyShape('all');
              setSelectedAIStatus('all');
              setSelectedApprovalStatus('all');
              setDateRange({ startDate: '', endDate: '' });
              toast.success('Filters cleared');
            }}
            className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* ========== ACTIVE FILTERS ========== */}
